import { Locale, Messages } from "@/types/i18n";
import { changeLanguage, getCurrentLocale } from "@/utils/i18n";
import { useCallback, useEffect, useState } from "react";

export const useTranslation = () => {
  const [messages, setMessages] = useState<Messages | null>(null);
  const [locale, setLocale] = useState(getCurrentLocale());

  useEffect(() => {
    const loadMessages = async () => {
      const msgs = await import(`../locales/${locale}/messages.json`);
      setMessages(msgs.default);
    };
    loadMessages();
  }, [locale]);

  const t = useCallback(
    (key: keyof Messages, params?: Record<string, any>): string => {
      if (!messages) return key as string;

      const message = messages[key];
      if (!message) return key as string;

      if (params) {
        return message.replace(/\{\{(\w+)\}\}/g, (match, param) => {
          return params[param]?.toString() || match;
        });
      }

      return message;
    },
    [messages],
  );

  const setLanguage = useCallback((newLocale: Locale) => {
    changeLanguage(newLocale);
    setLocale(newLocale);
  }, []);

  return { t, locale, setLanguage };
};
