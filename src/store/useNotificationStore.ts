import { create } from 'zustand';

export interface ToastPayload {
  type?: 'success' | 'info' | 'warning' | 'error';
  text1: string;
  text2?: string;
  duration?: number;
}

interface NotificationState {
  currentToast: ToastPayload | null;
  showToast: (payload: ToastPayload) => void;
  hideToast: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  currentToast: null,
  showToast: (payload) => set({ currentToast: payload }),
  hideToast: () => set({ currentToast: null }),
}));

export const Toast = {
  show: (payload: ToastPayload) => useNotificationStore.getState().showToast(payload),
  hide: () => useNotificationStore.getState().hideToast(),
};
