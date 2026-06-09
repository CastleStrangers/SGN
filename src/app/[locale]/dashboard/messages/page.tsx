"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Mail, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface Contact { id: string; name: string; email: string; subject: string; message: string; read: boolean; createdAt: string; }

export default function MessagesPage() {
  const { status } = useSession();
  const t = useTranslations("dashboard.messagesPage");
  const [msgs, setMsgs] = useState<Contact[]>([]);

  const fetchMessages = async () => {
    const res = await fetch("/api/contact"); const data = await res.json();
    if (Array.isArray(data)) setMsgs(data);
  };
  useEffect(() => { if (status === "authenticated") fetchMessages(); }, [status]);

  const markRead = async (id: string) => {
    await fetch("/api/contact", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, read: true }) });
    fetchMessages();
  };

  const deleteMsg = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    await fetch("/api/contact", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchMessages();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("title")}</h1>
      <div className="space-y-2">
        {msgs.map(m => (
          <div key={m.id} onClick={() => markRead(m.id)} className={`bg-white rounded-xl border p-4 cursor-pointer transition-colors ${!m.read ? "border-[#1a5632] bg-[#f0f7f2]" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!m.read ? "bg-[#1a5632] text-white" : "bg-gray-100 text-gray-500"}`}>
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{m.name}</p>
                  <p className="text-sm text-gray-500">{m.email}</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{m.subject}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{m.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(m.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteMsg(m.id); }} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {msgs.length === 0 && <p className="text-center text-gray-400 py-8">{t("noMessages")}</p>}
      </div>
    </div>
  );
}
