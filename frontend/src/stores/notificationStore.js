/**
 * Store de Notificações Push
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000';

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      // State
      preferences: {
        orderUpdates: true,
        promotions: true,
        reservations: true,
        marketing: false
      },
      isEnabled: false,
      lastPrompt: null,

      // Actions
      setPreferences: (preferences) => set({ preferences }),

      setEnabled: (enabled) => set({ isEnabled: enabled }),

      setLastPrompt: (date) => set({ lastPrompt: date }),

      // Check if should show prompt (once per 7 days)
      shouldShowPrompt: () => {
        const { lastPrompt, isEnabled } = get();
        if (isEnabled) return false;
        if (!lastPrompt) return true;

        const daysSince = (Date.now() - new Date(lastPrompt).getTime()) / (1000 * 60 * 60 * 24);
        return daysSince > 7;
      },

      // Sync preferences with server
      syncPreferences: async (token, endpoint) => {
        const { preferences } = get();

        try {
          const response = await fetch(`${API_URL}/api/push/preferences`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              endpoint,
              preferences
            })
          });

          if (response.ok) {
            const data = await response.json();
            set({ preferences: data.preferences });
            return true;
          }
        } catch (err) {
          console.error('Error syncing preferences:', err);
        }
        return false;
      }
    }),
    {
      name: 'flame-notifications',
      partialize: (state) => ({
        preferences: state.preferences,
        isEnabled: state.isEnabled,
        lastPrompt: state.lastPrompt
      })
    }
  )
);

export default useNotificationStore;
