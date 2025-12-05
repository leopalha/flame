/**
 * Service Worker para Push Notifications
 * Este arquivo complementa o SW gerado pelo next-pwa
 */

// Push notification event listeners
self.addEventListener('push', function(event) {
  console.log('[Push SW] Push received:', event);

  let data = {
    title: 'FLAME',
    body: 'Nova notificação',
    icon: '/logo-flame.png',
    badge: '/logo-flame.png',
    tag: 'default',
    data: {}
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/logo-flame.png',
    badge: data.badge || '/logo-flame.png',
    image: data.image,
    tag: data.tag || 'default',
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    renotify: data.renotify || false,
    silent: data.silent || false,
    vibrate: data.vibrate || [100, 50, 100]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', function(event) {
  console.log('[Push SW] Notification click:', event);

  event.notification.close();

  const data = event.notification.data || {};
  let url = data.url || '/';

  // Handle action clicks
  if (event.action) {
    switch (event.action) {
      case 'view':
        url = data.url || '/';
        break;
      case 'accept':
        // For order acceptance, could post to API
        url = data.url || '/staff/cozinha';
        break;
      case 'cancel':
        url = '/minhas-reservas';
        break;
      default:
        url = data.url || '/';
    }
  }

  // Handle notification type specific actions
  if (data.type) {
    switch (data.type) {
      case 'new_order':
        url = '/staff/cozinha';
        break;
      case 'order_ready':
      case 'order_status':
        url = '/meus-pedidos';
        break;
      case 'reservation_reminder':
        url = '/minhas-reservas';
        break;
      case 'promotion':
        url = data.url || '/cardapio';
        break;
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // Check if there's already a window open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if ('focus' in client) {
            return client.focus().then(function(focusedClient) {
              if ('navigate' in focusedClient) {
                return focusedClient.navigate(url);
              }
            });
          }
        }
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Notification close event
self.addEventListener('notificationclose', function(event) {
  console.log('[Push SW] Notification closed:', event);

  // Could track analytics here
  const data = event.notification.data || {};

  // Send analytics to server
  if (data.type) {
    fetch('/api/analytics/notification-closed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: data.type,
        tag: event.notification.tag,
        timestamp: Date.now()
      })
    }).catch(() => {});
  }
});

// Push subscription change
self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[Push SW] Subscription changed:', event);

  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: event.oldSubscription?.options?.applicationServerKey
    }).then(function(subscription) {
      // Re-subscribe on server
      return fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          deviceInfo: { deviceType: 'web' }
        })
      });
    })
  );
});

console.log('[Push SW] Push service worker loaded');
