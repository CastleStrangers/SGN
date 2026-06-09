import { describe, it, expect } from "vitest";
import { emailPattern, createFieldRules } from "../validations";

describe("emailPattern", () => {
  const validEmails = [
    "test@example.com",
    "user.name@domain.co",
    "user+tag@domain.org",
    "a@b.cd",
  ];

  const invalidEmails = [
    "",
    "notanemail",
    "@domain.com",
    "user@",
    "user@.com",
    "user@domain",
  ];

  validEmails.forEach((email) => {
    it(`accepts '${email}' as valid`, () => {
      expect(emailPattern.test(email)).toBe(true);
    });
  });

  invalidEmails.forEach((email) => {
    it(`rejects '${email}' as invalid`, () => {
      expect(emailPattern.test(email)).toBe(false);
    });
  });
});

describe("createFieldRules", () => {
  it("returns Arabic rules when locale is 'ar'", () => {
    const rules = createFieldRules("ar");
    expect(rules.name.required).toBe("الاسم مطلوب");
    expect(rules.password.minLength.message).toBe("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    expect(rules.email.pattern.message).toBe("بريد إلكتروني غير صالح");
  });

  it("returns English rules when locale is 'en'", () => {
    const rules = createFieldRules("en");
    expect(rules.name.required).toBe("Name is required");
    expect(rules.password.minLength.message).toBe("Password must be at least 6 characters");
    expect(rules.email.pattern.message).toBe("Invalid email");
  });

  it("returns Dutch rules when locale is 'nl'", () => {
    const rules = createFieldRules("nl");
    expect(rules.email.pattern.message).toBe("Ongeldig e-mailadres");
  });

  it("has expected structure for all fields", () => {
    const rules = createFieldRules("ar");
    expect(rules).toHaveProperty("name");
    expect(rules).toHaveProperty("email");
    expect(rules).toHaveProperty("password");
    expect(rules).toHaveProperty("subject");
    expect(rules).toHaveProperty("message");
  });

  it("message minLength is 10", () => {
    const rules = createFieldRules("ar");
    expect(rules.message.minLength.value).toBe(10);
  });
});
