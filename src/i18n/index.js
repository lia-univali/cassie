import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import pt from "./pt";
import { getLocalValue } from "../common/utils";

i18n.use(initReactI18next).init({
  lng: getLocalValue("selectedLanguage", "pt-BR"),
  fallbackLng: "pt-BR",
  resources: { "en-US": en, "pt-BR": pt },
  interpolation: { escapeValue: false },
});

export default i18n;
