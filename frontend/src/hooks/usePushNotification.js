/**
 * Hook para gerenciar Push Notifications
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000';

export function usePushNotification() {
  const [permission, setPermission] = useState('default');
  const [subscription, setSubscription] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated, token } = useAuthStore();

  // Check browser support
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    setIsSupported(supported);

    if (supported && typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    }
  }, []);

  // Check for existing subscription
  useEffect(() => {
    const checkSubscription = async () => {
      if (!isSupported) return;

      try {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
      } catch (err) {
        console.error('Error checking subscription:', err);
      }
    };

    checkSubscription();
  }, [isSupported]);

  // Get VAPID public key from server
  const getVapidKey = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/push/vapid-key`);
      const data = await response.json();
      return data.publicKey;
    } catch (err) {
      console.error('Error fetching VAPID key:', err);
      throw err;
    }
  }, []);

  // Convert VAPID key to Uint8Array
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!isSupported || typeof Notification === 'undefined') {
      setError('Push notifications não são suportadas neste navegador');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (err) {
      setError('Erro ao solicitar permissão');
      return false;
    }
  }, [isSupported]);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications não são suportadas');
      return null;
    }

    if (!isAuthenticated) {
      setError('Faça login para ativar notificações');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request permission if needed
      if (permission !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          setError('Permissão negada');
          return null;
        }
      }

      // Register push service worker
      await navigator.serviceWorker.register('/push-sw.js');

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Get VAPID key
      const vapidKey = await getVapidKey();

      // Subscribe to push
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });

      // Send subscription to server
      const response = await fetch(`${API_URL}/api/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subscription: sub.toJSON(),
          deviceInfo: {
            deviceType: detectDeviceType(),
            userAgent: navigator.userAgent
          }
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar no servidor');
      }

      setSubscription(sub);
      return sub;

    } catch (err) {
      console.error('Error subscribing:', err);
      setError(err.message || 'Erro ao ativar notificações');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, isAuthenticated, permission, token, requestPermission, getVapidKey]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!subscription) return true;

    setIsLoading(true);
    setError(null);

    try {
      // Unsubscribe from push manager
      await subscription.unsubscribe();

      // Remove from server
      if (isAuthenticated && token) {
        await fetch(`${API_URL}/api/push/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });
      }

      setSubscription(null);
      return true;

    } catch (err) {
      console.error('Error unsubscribing:', err);
      setError('Erro ao desativar notificações');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscription, isAuthenticated, token]);

  // Send test notification
  const sendTest = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError('Faça login primeiro');
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/api/push/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return data.success;

    } catch (err) {
      console.error('Error sending test:', err);
      return false;
    }
  }, [isAuthenticated, token]);

  // Update preferences
  const updatePreferences = useCallback(async (preferences) => {
    if (!subscription || !isAuthenticated || !token) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/api/push/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          preferences
        })
      });

      const data = await response.json();
      return data.preferences;

    } catch (err) {
      console.error('Error updating preferences:', err);
      return null;
    }
  }, [subscription, isAuthenticated, token]);

  return {
    // State
    permission,
    subscription,
    isSupported,
    isSubscribed: !!subscription,
    isLoading,
    error,

    // Actions
    requestPermission,
    subscribe,
    unsubscribe,
    sendTest,
    updatePreferences
  };
}

// Helper to detect device type
function detectDeviceType() {
  const ua = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios';
  }
  if (/android/.test(ua)) {
    return 'android';
  }
  if (/windows|macintosh|linux/.test(ua) && !/mobile/.test(ua)) {
    return 'desktop';
  }
  return 'web';
}

export default usePushNotification;
