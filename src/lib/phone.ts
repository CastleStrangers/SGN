/**
 * دالة احترافية لتنظيف وتنسيق أرقام الهواتف (Phone Number Sanitization)
 * تقوم بإزالة المسافات والرموز غير الصالحة، وتحويل `00` إلى `+`،
 * ودعم الأرقام الهولندية (31+) والسورية (963+) بشكل أفضل.
 */

export function cleanPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';

  // 1. إزالة جميع الرموز ما عدا الأرقام وإشارة الزائد
  let cleaned = phone.replace(/[^\d+]/g, '');

  // 2. تحويل 00 في البداية إلى +
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.substring(2);
  }

  // 3. إصلاح مشكلة تكرار إشارة الزائد إن وجدت خطأً
  cleaned = cleaned.replace(/^\++/, '+');

  // 4. معالجة الأرقام المحلية الهولندية (إذا بدأت بـ 06 ولم تبدأ بـ +)
  // مثال: 0612345678 -> +31612345678
  if (cleaned.startsWith('06') && cleaned.length === 10) {
    cleaned = '+31' + cleaned.substring(1);
  }

  // 5. معالجة الأرقام السورية المحلية (إذا بدأت بـ 09 ولم تبدأ بـ +)
  // مثال: 0912345678 -> +963912345678
  if (cleaned.startsWith('09') && cleaned.length === 10) {
    cleaned = '+963' + cleaned.substring(1);
  }

  return cleaned;
}

/**
 * التحقق مما إذا كان الرقم صالحاً شكلياً (يحتوي على الأقل على 9 أرقام إلى 15 رقم)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = cleanPhoneNumber(phone);
  // صيغة E.164: تبدأ بـ + (اختياري) وتتكون من 9 إلى 15 رقماً
  const pattern = /^\+?[1-9]\d{8,14}$/;
  return pattern.test(cleaned);
}
