import { ToastConfig } from '@ngneat/hot-toast';

export const TOAST_CONFIG: Partial<ToastConfig> = {
  autoClose: true,
  style: {
    backgroundColor: 'var(--surface-0)',
    color: 'var(--primary-500)',
  },
};
