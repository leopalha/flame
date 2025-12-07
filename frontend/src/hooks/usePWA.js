import { useState, useEffect, useCallback } from 'react';

export const usePWA = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [swRegistration, setSwRegistration] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize PWA
  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      } else if (window.navigator.standalone === true) {
        setIsInstalled(true); // iOS Safari
      }
    };

    checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set initial online status
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register Service Worker for Push Notifications
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registrado:', registration.scope);
          setSwRegistration(registration);

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ Falha ao registrar Service Worker:', error);
        });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  // Install app
  const installApp = useCallback(async () => {
    if (!deferredPrompt) return false;

    setIsLoading(true);
    
    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('App installation failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [deferredPrompt]);

  // Update app
  const updateApp = useCallback(() => {
    if (!swRegistration || !updateAvailable) return;

    if (swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
      window.location.reload();
    }
  }, [swRegistration, updateAvailable]);

  // Share content
  const shareContent = useCallback(async (shareData) => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
        return false;
      }
    }
    
    // Fallback: copy to clipboard
    if (shareData.url && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        return true;
      } catch (error) {
        console.error('Clipboard write failed:', error);
        return false;
      }
    }
    
    return false;
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'not-supported';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }, []);

  // Show notification
  const showNotification = useCallback(async (title, options = {}) => {
    const permission = await requestNotificationPermission();
    
    if (permission !== 'granted') {
      return false;
    }

    if (swRegistration) {
      await swRegistration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options
      });
      return true;
    }

    return false;
  }, [swRegistration, requestNotificationPermission]);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    if (!swRegistration || !window.PushManager) {
      console.warn('Push messaging is not supported');
      return null;
    }

    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      return null;
    }

    try {
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }, [swRegistration, requestNotificationPermission]);

  // Add to home screen prompt for iOS
  const showIOSInstallPrompt = useCallback(() => {
    if (!/iPad|iPhone|iPod/.test(navigator.userAgent)) return false;

    // Show custom iOS install instructions
    return true;
  }, []);

  // Get app info
  const getAppInfo = useCallback(async () => {
    if (swRegistration) {
      try {
        const messageChannel = new MessageChannel();
        return new Promise((resolve) => {
          messageChannel.port1.onmessage = (event) => {
            resolve(event.data);
          };
          
          if (swRegistration.active) {
            swRegistration.active.postMessage(
              { type: 'GET_VERSION' },
              [messageChannel.port2]
            );
          }
        });
      } catch (error) {
        console.error('Failed to get app info:', error);
        return null;
      }
    }
    
    return null;
  }, [swRegistration]);

  // Background sync
  const requestBackgroundSync = useCallback(async (tag) => {
    if (!swRegistration || !swRegistration.sync) {
      console.warn('Background sync not supported');
      return false;
    }

    try {
      await swRegistration.sync.register(tag);
      return true;
    } catch (error) {
      console.error('Background sync registration failed:', error);
      return false;
    }
  }, [swRegistration]);

  // Cache management
  const clearCache = useCallback(async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      return true;
    }
    return false;
  }, []);

  const getCacheSize = useCallback(async () => {
    if ('caches' in window && 'storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          usage: estimate.usage || 0,
          quota: estimate.quota || 0,
          usagePercentage: estimate.usage && estimate.quota 
            ? Math.round((estimate.usage / estimate.quota) * 100)
            : 0
        };
      } catch (error) {
        console.error('Failed to get cache size:', error);
        return null;
      }
    }
    return null;
  }, []);

  return {
    // Status
    isInstalled,
    isInstallable,
    isOnline,
    updateAvailable,
    isLoading,
    swRegistration,
    
    // Actions
    installApp,
    updateApp,
    shareContent,
    showNotification,
    subscribeToPush,
    requestNotificationPermission,
    showIOSInstallPrompt,
    getAppInfo,
    requestBackgroundSync,
    clearCache,
    getCacheSize
  };
};

export default usePWA;