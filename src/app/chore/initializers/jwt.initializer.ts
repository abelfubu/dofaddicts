import { inject } from '@angular/core';
import { GlobalStore } from '@shared/store/global.store';
import { CookieService } from 'ngx-cookie-service';

export function jwtInitalizer(): () => void {
  const localStorageService = inject(CookieService);
  const store = inject(GlobalStore);

  return () => {
    const accessToken = localStorageService.get('token');
    store.setLoggedIn({ accessToken });
  };
}
