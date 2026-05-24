import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations } from "../constants/translations";

const LANGUAGE_KEY = "app_language";

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState("pt-BR");

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((saved) => {
      if (saved) setLanguage(saved);
    });
  }, []);

  const changeLanguage = useCallback(async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  }, []);

  const t = useCallback(
    (key) => {
      return translations[language]?.[key] ?? translations["pt-BR"]?.[key] ?? key;
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, changeLanguage, t }),
    [language, changeLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n deve ser usado dentro de I18nProvider");
  return context;
}
