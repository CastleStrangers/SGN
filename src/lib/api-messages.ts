import arMessages from '../../messages/ar.json';
import enMessages from '../../messages/en.json';
import nlMessages from '../../messages/nl.json';

type Messages = Record<string, any>;

const allMessages: Record<string, Messages> = { ar: arMessages, en: enMessages, nl: nlMessages };

export function getApiMessage(locale: string, key: string, vars?: Record<string, string>): string {
  const msgs = allMessages[locale] || allMessages.ar;
  const keys = key.split('.');
  let current: any = msgs;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return key;
    }
  }
  let result = typeof current === 'string' ? current : key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
  }
  return result;
}
