import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  inject,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { HotToastModule } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { TOAST_CONFIG } from './chore/config/toast.config';
import { jwtInitalizer } from './chore/initializers/jwt.initializer';
import { TranslocoRootModule } from './chore/modules/transloco-root.module';
import { appRoutes } from './chore/routes/app.routes';
import { WINDOW } from './chore/tokens/window.token';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { loadingInterceptor } from './shared/interceptors/loading.interceptor';

export function preloadUserLanguage() {
  const translate = inject(TranslocoService);
  return () => {
    translate.config.availableLangs?.forEach(async (favLang) => {
      await translate.load(favLang.toString()).toPromise();
    });
  };
}

export const config: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, loadingInterceptor]),
      withFetch(),
    ),
    provideRouter(appRoutes),
    provideAnimations(),
    importProvidersFrom([
      TranslocoRootModule,
      HotToastModule.forRoot(TOAST_CONFIG),
      // ServiceWorkerModule.register('ngsw-worker.js', {
      //   enabled: environment.production,
      //   registrationStrategy: 'registerWhenStable:30000',
      // }),
    ]),
    {
      provide: APP_INITIALIZER,
      useFactory: jwtInitalizer,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: preloadUserLanguage,
      multi: true,
    },
    {
      provide: WINDOW,
      useFactory: () => (typeof window !== 'undefined' ? window : null),
    },
  ],
};
