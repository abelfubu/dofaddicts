import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';

export const LanguageConfig = new InjectionToken<LanguagesConfig>('LanguageConfig');

export interface LanguagesConfig {
  supportedLanguages: string[];
}

const defaultConfig: LanguagesConfig = {
  supportedLanguages: [],
};

export function provideLanguages(config: LanguagesConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: LanguageConfig,
      useValue: {
        ...defaultConfig,
        ...config,
      },
    },
  ]);
}
