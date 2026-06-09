import { describe, it, expect } from "vitest";
import { getApiMessage } from "../api-messages";

describe("getApiMessage", () => {
  it("returns Arabic message for 'common.backToHome'", () => {
    expect(getApiMessage("ar", "common.backToHome")).toBe("العودة إلى الرئيسية");
  });

  it("returns English message for 'common.backToHome'", () => {
    expect(getApiMessage("en", "common.backToHome")).toBe("Back to Home");
  });

  it("returns Dutch message for 'common.backToHome'", () => {
    expect(getApiMessage("nl", "common.backToHome")).toBe("Terug naar Home");
  });

  it("returns key itself for nonexistent key", () => {
    expect(getApiMessage("ar", "nonexistent.deep.key")).toBe("nonexistent.deep.key");
  });

  it("falls back to Arabic for unsupported locale", () => {
    expect(getApiMessage("fr", "common.backToHome")).toBe("العودة إلى الرئيسية");
  });

  it("replaces variables in message", () => {
    const result = getApiMessage("ar", "api.newDonationMessage", { amount: "€50", name: "أحمد" });
    expect(result).toContain("€50");
    expect(result).toContain("أحمد");
  });

  it("returns key for non-string leaf value", () => {
    expect(getApiMessage("ar", "tabs")).toBe("tabs");
  });

  it("handles nested 3-level key", () => {
    expect(getApiMessage("en", "sidebar.join.title")).toBe("Join the Community");
  });
});
