import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import as from './locales/as.json';

// Supported North Eastern & National Languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'ne', name: 'नेपाली (Nepali)' },
  { code: 'mni', name: 'মৈতৈলোন্ (Manipuri)' },
  { code: 'brx', name: 'बड़ो (Bodo)' },
  { code: 'lus', name: 'Mizo ṭawng (Mizo)' },
  { code: 'kha', name: 'Ka Ktien Khasi (Khasi)' },
] as const;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    as: { translation: as },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
