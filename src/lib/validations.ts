import { getApiMessage } from './api-messages';

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createFieldRules(locale: string = 'ar') {
  const t = (key: string) => getApiMessage(locale, key);
  return {
    name: { required: t('validation.nameRequired'), minLength: { value: 2, message: t('validation.nameMinLength') } },
    email: { required: t('validation.emailRequired'), pattern: { value: emailPattern, message: t('validation.emailInvalid') } },
    password: { required: t('validation.passwordRequired'), minLength: { value: 6, message: t('validation.passwordMinLength') } },
    subject: { required: t('validation.subjectRequired'), minLength: { value: 2, message: t('validation.subjectRequired') } },
    message: { required: t('validation.messageRequired'), minLength: { value: 10, message: t('validation.messageMinLength') } },
  };
}

export const fieldRules = createFieldRules('ar');
