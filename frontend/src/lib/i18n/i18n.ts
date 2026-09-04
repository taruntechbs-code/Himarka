import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import as from './locales/as.json';
import bn from './locales/bn.json';
import hi from './locales/hi.json';
import ne from './locales/ne.json';
import mni from './locales/mni.json';
import brx from './locales/brx.json';
import lus from './locales/lus.json';
import kha from './locales/kha.json';

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

export type SupportedLanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    as: { translation: as },
    bn: { translation: bn },
    hi: { translation: hi },
    ne: { translation: ne },
    mni: { translation: mni },
    brx: { translation: brx },
    lus: { translation: lus },
    kha: { translation: kha },
  },
  lng: (typeof localStorage !== 'undefined' && localStorage.getItem('himarka_language')) || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const changeLanguage = (lng: SupportedLanguageCode) => {
  i18n.changeLanguage(lng);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('himarka_language', lng);
  }
};

export default i18n;
