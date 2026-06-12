"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/date";
import { Search, CheckCircle, XCircle, Clock, DollarSign, Heart } from "lucide-react";

interface Donation {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  amount: number;
  currency: string;
  message: string | null;
  paymentMethod: string | null;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

export default function DonationsPage() {
  const t = useTranslations("dashboard.donationsPage");
  const locale = useLocale();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState<{
    totalCount: number;
    totalAmount: number;
    byStatus: Record<string, { count: number; amount: number }>;
  } | null>(null);

  const fetchDonations = useCallback(async () => {
    try {
      const res = await fetch("/api/donations");
      if (res.ok) {
        const data = await res.json();
        setDonations(data.donations);
        setTotal(data.total);
      }
    } catch {
      console.error("Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/donations/stats");
      if (res.ok) {
        setStats(await res.json());
      }
    } catch {
      console.error("Failed to fetch stats");
    }
  }, []);

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, [fetchDonations, fetchStats]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/donations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setDonations((prev) =>
          prev.map((d) =>
            d.id === id
              ? { ...d, status, paidAt: status === "completed" ? new Date().toISOString() : d.paidAt }
              : d
          )
        );
        fetchStats();
      }
    } catch {
      console.error("Failed to update status");
    }
  };

  const filtered = donations.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.email || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-[#1a5632] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t("totalDonations")}</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t("totalAmount")}</p>
                <p className="text-xl font-bold text-gray-900">€{stats.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t("pending")}</p>
                <p className="text-xl font-bold text-gray-900">{stats.byStatus?.pending?.count || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t("completed")}</p>
                <p className="text-xl font-bold text-gray-900">{stats.byStatus?.completed?.count || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t("noDonations")}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-right p-3 font-bold text-gray-600">{t("date")}</th>
                  <th className="text-right p-3 font-bold text-gray-600">{t("donor")}</th>
                  <th className="text-right p-3 font-bold text-gray-600">{t("amount")}</th>
                  <th className="text-right p-3 font-bold text-gray-600 hidden md:table-cell">الرسالة</th>
                  <th className="text-right p-3 font-bold text-gray-600">الحالة</th>
                  <th className="text-right p-3 font-bold text-gray-600">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-3 text-gray-600 whitespace-nowrap text-xs">
                      {formatDate(d.createdAt, locale)}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-gray-900">{d.name}</div>
                      {(d.email || d.phone) && (
                        <div className="text-xs text-gray-500">{d.email || d.phone}</div>
                      )}
                    </td>
                    <td className="p-3 font-bold text-gray-900">€{d.amount.toFixed(2)}</td>
                    <td className="p-3 text-gray-500 text-xs max-w-[200px] truncate hidden md:table-cell">
                      {d.message || "—"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          d.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : d.status === "failed"
                            ? "bg-red-50 text-red-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {d.status === "completed" && <CheckCircle className="w-3 h-3" />}
                        {d.status === "failed" && <XCircle className="w-3 h-3" />}
                        {d.status === "pending" && <Clock className="w-3 h-3" />}
                        {d.status === "completed" ? t("completed") : d.status === "failed" ? t("failed") : t("pending")}
                      </span>
                    </td>
                    <td className="p-3">
                      {d.status === "pending" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateStatus(d.id, "completed")}
                            className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                          >
                            {t("markCompleted")}
                          </button>
                          <button
                            onClick={() => updateStatus(d.id, "failed")}
                            className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                          >
                            {t("markFailed")}
                          </button>
                        </div>
                      )}
                      {d.status === "completed" && (
                        <span className="text-xs text-gray-400">
                          {d.paidAt ? formatDate(d.paidAt, locale) : ""}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400">
        إجمالي: {total} تبرع
      </div>
    </div>
  );
}
