import { Injectable, inject } from '@angular/core';
import { LOCAL_STORAGE } from '@chore/tokens/local-storage.token';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  localStorage = inject(LOCAL_STORAGE);

  set<T>(key: string, value: T): void {
    this.localStorage.setItem(key, JSON.stringify({ value }));
  }

  remove(key: string): void {
    this.localStorage.removeItem(key);
  }

  get<T>(key: string): T {
    const found = this.localStorage.getItem(key);
    return found ? JSON.parse(found).value : null;
  }

  update<T>(key: string, id: number, value: T): T {
    const found = this.get<Record<string, T>>(key) ?? {};
    found[id] = { ...found[id], ...value };
    this.set(key, found);
    return found[id];
  }
}
