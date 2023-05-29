import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { config as appConfig } from './app.config';
import { LOCAL_STORAGE } from './chore/tokens/local-storage.token';
import { NAVIGATOR } from './chore/tokens/navigator.token';

const serverConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideServerRendering(),
    {
      provide: LOCAL_STORAGE,
      useValue: {
        getItem: () => null,
        removeItem: () => null,
        setItem: () => null,
      },
    },
    {
      provide: NAVIGATOR,
      useValue: {
        language: 'en',
      },
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
