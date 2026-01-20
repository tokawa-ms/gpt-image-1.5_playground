"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  Locale,
  localeCookieName,
  supportedLocales,
} from "./messages";
import { createTranslator } from "./translate";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  supportedLocales: readonly Locale[];
};

const I18nContext = createContext<I18nContextValue | null>(null);

type LocaleProviderProps = {
  initialLocale?: Locale;
  children: ReactNode;
};

export function LocaleProvider({ initialLocale, children }: LocaleProviderProps) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale ?? defaultLocale,
  );
  const t = useMemo(() => createTranslator(locale), [locale]);

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      if (nextLocale === locale) {
        return;
      }
      setLocaleState(nextLocale);
      const maxAge = 60 * 60 * 24 * 365;
      document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=${maxAge}`;
      router.refresh();
    },
    [locale, router],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, supportedLocales }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context) {
    return context;
  }

  return {
    locale: defaultLocale,
    setLocale: () => {},
    t: createTranslator(defaultLocale),
    supportedLocales,
  } as I18nContextValue;
}
