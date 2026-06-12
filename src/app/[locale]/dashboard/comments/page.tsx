"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Trash2, CheckCircle, XCircle, Reply } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/date";

interface Comment { id: string; postId: string; author: string; content: string; approved: boolean; likes: number; createdAt: string; parentId?: string | null; replies?: Comment[]; }

export default function CommentsPage() {
  const { data: session, status } = useSession();
  const t = useTranslations("dashboard.commentsPage");
  const [comments, setComments] = useState<Comment[]>([]);

  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (role && role !== "admin") window.location.href = "/dashboard";
  }, [role]);

  const fetchComments = async () => {
    const res = await fetch("/api/comments?all=true"); const data = await res.json();
    if (Array.isArray(data)) setComments(data);
  };

  useEffect(() => { if (status === "authenticated" && role === "admin") fetchComments(); }, [status, role]);

  const toggleApproval = async (id: string, approved: boolean) => {
    await fetch("/api/comments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, approved }) });
    fetchComments();
  };

  const deleteComment = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    await fetch("/api/comments", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchComments();
  };

  const topLevel = comments.filter(c => !c.parentId);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("title")} ({comments.length})</h1>
      <div className="space-y-2">
        {topLevel.map(c => (
          <CommentRow key={c.id} comment={c} replies={comments.filter(r => r.parentId === c.id)} onToggle={toggleApproval} onDelete={deleteComment} t={t} />
        ))}
        {topLevel.length === 0 && <p className="text-center text-gray-400 py-8">{t("noComments")}</p>}
      </div>
    </div>
  );
}

function CommentRow({ comment, replies, onToggle, onDelete, t }: {
  comment: Comment; replies: Comment[]; onToggle: (id: string, approved: boolean) => void; onDelete: (id: string) => void; t: any;
}) {
  const locale = useLocale();
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-sm">{comment.author}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${comment.approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
              {comment.approved ? t("approved") : t("pending")}
            </span>
          </div>
          <p className="text-gray-600 text-sm mt-1">{comment.content}</p>
          <p className="text-xs text-gray-400 mt-1">{formatDate(comment.createdAt, locale)}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onToggle(comment.id, !comment.approved)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400">
            {comment.approved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          </button>
          <button onClick={() => onDelete(comment.id)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {replies.length > 0 && (
        <div className="mr-6 mt-3 space-y-2 border-r-2 border-gray-100 pr-4">
          {replies.map(r => (
            <div key={r.id} className="flex items-start justify-between gap-3 py-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Reply className="w-3 h-3 text-gray-400" />
                  <span className="font-bold text-gray-900 text-xs">{r.author}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${r.approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {r.approved ? t("approved") : t("pending")}
                  </span>
                </div>
                <p className="text-gray-600 text-xs mt-0.5">{r.content}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => onToggle(r.id, !r.approved)} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                  {r.approved ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => onDelete(r.id)} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
