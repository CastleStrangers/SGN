"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Mail, Trash2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/date";

interface Subscriber { id: string; email: string; createdAt: string; }

export default function SubscribersPage() {
  const { status } = useSession();
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const [subs, setSubs] = useState<Subscriber[]>([]);

  const loadSubs = async () => {
    const res = await fetch("/api/subscribe"); const data = await res.json();
    if (Array.isArray(data)) setSubs(data);
  };
  useEffect(() => { if (status === "authenticated") loadSubs(); }, [status]);

  const remove = async (id: string) => {
    if (!confirm("تأكيد الحذف؟")) return;
    await fetch("/api/subscribe", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    loadSubs();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("subscribers")}</h1>
      <div className="bg-white rounded-2xl border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-right px-4 py-3 font-medium text-gray-600">البريد الإلكتروني</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">تاريخ الاشتراك</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subs.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{s.email}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(s.createdAt, locale)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => remove(s.id)} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {subs.length === 0 && <p className="text-center text-gray-400 py-8">لا يوجد مشتركون</p>}
      </div>
    </div>
  );
}
