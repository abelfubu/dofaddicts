import { mergeApplicationConfig } from '@angular/core';
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config';
import { LOCAL_STORAGE } from './app/chore/tokens/local-storage.token';
import { NAVIGATOR } from './app/chore/tokens/navigator.token';

bootstrapApplication(
  AppComponent,
  mergeApplicationConfig(
    {
      providers: [
        provideClientHydration(),
        {
          provide: LOCAL_STORAGE,
          useValue: window.localStorage,
        },
        {
          provide: NAVIGATOR,
          useValue: window.navigator,
        },
      ],
    },
    config
  )
).catch((err) => console.error(err));
