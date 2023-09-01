import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import enMessages from "src/i18n/en.js";
import ruMessages from "src/i18n/ru.js";

const messages = {
  en: enMessages,
  ru: ruMessages,
};

const i18n = createI18n({
  locale: "ru",
  fallbackLocale: "ru",
  messages,
  silentTranslationWarn: true,
  missingWarn: false,
  fallbackWarn: false,
  silentFallbackWarn: true,
  legacy: true,
});

export default ({ app }) => {
  app.use(i18n);
};

export { i18n };
