import { string } from 'yup';
import translations from 'translations/i18next';

export const emailValidationRegexp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,25}$/i;
export const phoneValidationRegexp = /\+[0-9]{9,20}/;

export const EmailValidation = (isPlural: boolean) =>
  string().matches(emailValidationRegexp, translations.t('forms.invalidEmail', { count: isPlural ? 2 : 1 }));

export const requiredMessageKey = 'forms.required';
