import { inject } from '@angular/core';
import { GlobalStore } from '@shared/store/global.store';
import { CookieService } from 'ngx-cookie-service';

export function jwtInitalizer(): () => void {
  const cookieService = inject(CookieService);
  const store = inject(GlobalStore);

  return () => {
    const accessToken = cookieService.get('token');
    store.setLoggedIn({ accessToken });
  };
}
