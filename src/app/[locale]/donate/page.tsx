"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Heart, CheckCircle, Landmark } from "lucide-react";

const presetAmounts = [10, 25, 50, 100];

export default function DonatePage() {
  const t = useTranslations("donate");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [amount, setAmount] = useState<number | "">(25);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [bankDetails, setBankDetails] = useState<{
    iban: string;
    bankName: string;
    accountHolder: string;
  } | null>(null);

  const handlePreset = (val: number) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    setAmount(val ? parseFloat(val) : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const finalAmount = amount;
    if (!name.trim()) {
      setError(t("error"));
      setLoading(false);
      return;
    }
    if (!finalAmount || finalAmount <= 0) {
      setError(t("error"));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          amount: finalAmount,
          message: message.trim() || undefined,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("error"));
        setLoading(false);
        return;
      }

      if (data.bankDetails) {
        setBankDetails(data.bankDetails);
      }
      setSuccess(true);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4" dir={isRtl ? "rtl" : "ltr"}>
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("success", { name })}
            </h1>
            <p className="text-gray-500 mb-6">{t("subtitle")}</p>

            {bankDetails && (
              <div className={`bg-gray-50 rounded-xl p-6 ${isRtl ? "text-right" : "text-left"}`}>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 justify-center">
                  <Landmark className="w-5 h-5" />
                  {t("bankDetails")}
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">{t("bankAccount")}: </span>
                    <span className="font-mono font-bold text-gray-900" dir="ltr">{bankDetails.iban}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t("bankName")}: </span>
                    <span className="font-bold text-gray-900">{bankDetails.bankName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t("bankHolder")}: </span>
                    <span className="font-bold text-gray-900">{bankDetails.accountHolder}</span>
                  </div>
                  <div className="pt-3 text-xs text-gray-400">
                    {t("reference")}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
          <p className="text-gray-500">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">{t("amount")}</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {presetAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePreset(val)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    amount === val && !customAmount
                      ? "bg-[#1a5632] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  €{val}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              step="1"
              placeholder={t("customAmount")}
              value={customAmount}
              onChange={handleCustomChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t("name")} *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={t("name")}
              title={t("name")}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t("email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email")}
                title={t("email")}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t("phone")}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("phone")}
                title={t("phone")}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t("message")}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("messagePlaceholder")}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t("paymentMethod")}</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl cursor-pointer hover:border-[#1a5632] transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="accent-[#1a5632]"
                />
                <span className="text-sm">{t("bankTransfer")}</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1a5632] text-white rounded-xl font-bold text-sm hover:bg-[#0f3d23] transition-colors disabled:opacity-50"
          >
            {loading ? t("submitting") : t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
