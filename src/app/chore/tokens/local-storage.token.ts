import { InjectionToken } from '@angular/core';
export const LOCAL_STORAGE = new InjectionToken<{
  getItem: (key: string) => string;
  removeItem: (key: string) => void;
  setItem: (key: string, value: string) => void;
}>('LOCAL_STORAGE');
