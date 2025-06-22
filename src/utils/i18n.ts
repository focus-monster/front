import { Locale, Messages } from "@/types/i18n";

const loadMessages = async (locale: Locale): Promise<Messages> => {
  const messages = await import(`../locales/${locale}/messages.json`);
  return messages.default;
};

export const getCurrentLocale = (): Locale => {
  const saved = localStorage.getItem("locale") as Locale;
  if (saved && (saved === "ko" || saved === "en")) {
    return saved;
  }

  const browserLang = navigator.language.split("-")[0];
  return browserLang === "ko" ? "ko" : "en";
};

export const interpolate = (
  message: string,
  params: Record<string, any>,
): string => {
  return message.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
};

export const translate = async (
  key: keyof Messages,
  params?: Record<string, any>,
): Promise<string> => {
  const locale = getCurrentLocale();
  const messages = await loadMessages(locale);
  const message = messages[key];

  if (!message) {
    console.warn(`Translation key not found: ${key}`);
    return key as string;
  }

  return params ? interpolate(message, params) : message;
};

export const changeLanguage = (locale: Locale) => {
  localStorage.setItem("locale", locale);
};
