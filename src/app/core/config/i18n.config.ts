import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";

export const SUPPORTED_LANGS = ['en', 'fr'] as const;
export type SupportedLangs = typeof SUPPORTED_LANGS[number];
export const DEFAULT_LANG: SupportedLangs = 'en';
export const FALLBACK_LANG: SupportedLangs = 'en';

export const i18nProviders = [
  provideTranslateService({
    loader: provideTranslateHttpLoader({
      prefix: 'assets/i18n/',
      suffix: '.json',
    }),
    lang: DEFAULT_LANG,
    fallbackLang: FALLBACK_LANG,
  }),
];