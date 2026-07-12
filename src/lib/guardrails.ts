const PII_PATTERNS: { regex: RegExp; replacement: string }[] = [
  { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: "[email]" },
  { regex: /(?:\+31[\s-]?|0031[\s-]?)(?:6[\s-]?[0-9][\s-]?[0-9][\s-]?[0-9][\s-]?[0-9][\s-]?[0-9][\s-]?[0-9][\s-]?[0-9][\s-]?[0-9])/g, replacement: "[phone-nl]" },
  { regex: /(?:\+963[\s-]?|00963[\s-]?)(?:9[0-9]{1,2}[\s-]?[0-9]{3}[\s-]?[0-9]{4})/g, replacement: "[phone-sy]" },
  { regex: /\b\d{9}\b/g, replacement: "[bsn]" },
  { regex: /\bNL\d{2}[A-Z]{4}\d{10}\b/g, replacement: "[iban]" },
  { regex: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, replacement: "[credit-card]" },
  { regex: /\b(?:Straat|Street|Laan|Weg|Plein|Kade|Gracht|Singel|Dreef|Steeg|Pad|Allee|Gasse|Platz|Rue|Boulevard|Avenue)\s+\d+/gi, replacement: "[address]" },
];

const INJECTION_PATTERNS: { regex: RegExp; severity: number }[] = [
  { regex: /ignore\s+(?:all\s+)?(?:previous|above|prior)\s+instructions/i, severity: 3 },
  { regex: /system\s*:\s*override/i, severity: 3 },
  { regex: /you\s+(?:are\s+)?(?:now|will\s+now)\s+(?:act\s+as|pretend|behave)/i, severity: 2 },
  { regex: /forget|disregard|ignore\s+(?:your\s+)?(?:instructions|prompt|rules)/i, severity: 3 },
  { regex: /do\s+(?:not\s+)?(?:follow|obey)\s+(?:your\s+)?(?:instructions|prompt)/i, severity: 3 },
  { regex: /```[\s\S]*?(?:system|user|assistant)[\s\S]*?```/i, severity: 2 },
  { regex: /role\s*:\s*(?:system|assistant|user)/i, severity: 1 },
];

export interface GuardrailResult {
  blocked: boolean;
  message?: string;
  modifiedInput?: string;
  riskScore: number;
}

export function maskPII(text: string): string {
  let result = text;
  for (const { regex, replacement } of PII_PATTERNS) {
    result = result.replace(regex, replacement);
  }
  return result;
}

export function maskPIIInMessages(messages: { role: string; content: string }[]): { role: string; content: string }[] {
  return messages.map(msg => ({
    ...msg,
    content: maskPII(msg.content),
  }));
}

export function checkPromptInjection(text: string): GuardrailResult {
  let maxSeverity = 0;
  let triggered = false;

  for (const { regex, severity } of INJECTION_PATTERNS) {
    if (regex.test(text)) {
      maxSeverity = Math.max(maxSeverity, severity);
      triggered = true;
    }
  }

  return {
    blocked: maxSeverity >= 3,
    riskScore: maxSeverity,
    message: triggered ? `Prompt injection detected (severity: ${maxSeverity})` : undefined,
  };
}

export function checkInjectionInMessages(messages: { role: string; content: string }[]): GuardrailResult {
  let maxSeverity = 0;

  for (const msg of messages) {
    if (msg.role === "user") {
      const result = checkPromptInjection(msg.content);
      maxSeverity = Math.max(maxSeverity, result.riskScore);
    }
  }

  return {
    blocked: maxSeverity >= 3,
    riskScore: maxSeverity,
    message: maxSeverity >= 3 ? "Prompt injection blocked" : undefined,
  };
}

export function applyGuardrails(input: { messages: { role: string; content: string }[]; systemPrompt?: string }): {
  messages: { role: string; content: string }[];
  systemPrompt?: string;
  blocked: boolean;
  reason?: string;
} {
  const injection = checkInjectionInMessages(input.messages);
  if (injection.blocked) {
    return { messages: input.messages, systemPrompt: input.systemPrompt, blocked: true, reason: injection.message };
  }

  if (input.systemPrompt) {
    const sysInjection = checkPromptInjection(input.systemPrompt);
    if (sysInjection.blocked) {
      return { messages: input.messages, systemPrompt: input.systemPrompt, blocked: true, reason: sysInjection.message };
    }
  }

  return {
    messages: maskPIIInMessages(input.messages),
    systemPrompt: input.systemPrompt ? maskPII(input.systemPrompt) : undefined,
    blocked: false,
  };
}
