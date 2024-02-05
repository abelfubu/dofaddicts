import { inject } from '@angular/core';
import { Route, UrlSegment } from '@angular/router';

import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { TranslocoService, getBrowserLang } from '@ngneat/transloco';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { LoginComponent } from '@pages/login/login.component';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs';
import { loginPath } from './paths/login.path';
import { notFoundPath } from './paths/not-found.path';

export const appRoutes: Route[] = [
  loginPath,
  {
    path: '',
    component: LoginComponent,
    canActivate: [
      (_route: Route) => {
        const cookieService = inject(CookieService);
        const translate = inject(TranslocoService);
        const favLang = cookieService.get(environment.favLangKey);
        const response = inject(RESPONSE, { optional: true });
        const router = inject(Router);

        if (favLang) {
          if (window !== undefined) {
            router.navigate([`/${favLang}`]);
          } else {
            response?.redirect(301, `/${favLang}`);
          }
          return false;
        }

        const browserLang = getBrowserLang() || 'en';

        if (
          translate.getAvailableLangs().some((lang) => lang === browserLang)
        ) {
          if (window !== undefined) {
            router.navigate([`/${browserLang}`]);
          } else {
            response?.redirect(301, `/${browserLang}`);
          }
          return false;
        }

        return false;
      },
    ],
  },
  {
    path: ':language',
    canMatch: [
      (_route: Route, segments: UrlSegment[]) => {
        const translate = inject(TranslocoService);

        if (
          translate
            .getAvailableLangs()
            .some((lang) => lang === segments[0].path)
        ) {
          translate.setActiveLang(segments[0].path);
          return translate.load(segments[0].path).pipe(map(() => true));
        }

        return false;
      },
    ],
    loadChildren: () =>
      import('@chore/routes/language.routes').then((m) => m.configureRoutes()),
  },
  notFoundPath,
];
