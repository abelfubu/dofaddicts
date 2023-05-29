import { inject } from '@angular/core';
import { environment } from '@environments/environment';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { GlobalStore } from '@shared/store/global.store';

export function jwtInitalizer(): () => void {
  const localStorageService = inject(LocalStorageService);
  const store = inject(GlobalStore);

  return () => {
    const accessToken = localStorageService.get<string>(environment.authKey);
    store.setLoggedIn({ accessToken });
  };
}
