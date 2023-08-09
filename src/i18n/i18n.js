import { createI18n } from 'vue-i18n';
import en from './en';
import ru from './ru';

const messages = {
  en,
  ru,
};

const i18n = createI18n({
  locale: 'en', // default locale
  fallbackLocale: 'en', // fallback locale
  messages,
});

export default i18n;
