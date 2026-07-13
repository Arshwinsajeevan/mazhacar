/**
 * Service to handle native browser notifications.
 */
export const notificationService = {
  /**
   * Request browser permission to show notifications.
   */
  requestPermission: async (): Promise<NotificationPermission> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }
    return Notification.permission;
  },

  /**
   * Send a browser notification.
   */
  send: (title: string, options?: NotificationOptions) => {
    if (
      typeof window === 'undefined' ||
      !('Notification' in window) ||
      Notification.permission !== 'granted'
    ) {
      return null;
    }

    try {
      const defaultOptions: any = {
        icon: '/logo.png',
        badge: '/logo.png',
        tag: 'mazhacar-weather-alert',
        renotify: true,
        ...options,
      };
      return new Notification(title, defaultOptions);
    } catch (e) {
      console.warn('Notifications failed to trigger: ', e);
      return null;
    }
  },
};

export default notificationService;
