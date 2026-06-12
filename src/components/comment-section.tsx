"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle, Send, Clock, Heart, Reply } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/date";

interface Comment {
  id: string; author: string; content: string; createdAt: string; userId?: string | null; likes: number;
  replies?: Comment[];
}

export function CommentSection({ postId }: { postId: string }) {
  const t = useTranslations('comments');
  const locale = useLocale();
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?postId=${postId}`);
    const data = await res.json();
    if (Array.isArray(data)) setComments(data);
  };

  useEffect(() => { fetchComments(); }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        author: session?.user?.name || t('visitor'),
        content,
        userId: (session?.user as any)?.id || null,
        parentId: replyTo,
      }),
    });
    if (res.ok) { setContent(""); setReplyTo(null); fetchComments(); }
    setLoading(false);
  };

  const handleLike = async (id: string) => {
    await fetch("/api/comments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, like: true }) });
    fetchComments();
  };

  const totalComments = comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);

  return (
    <div id="comments" className="mt-8 pt-6 border-t">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-[#1a5632]" /> {t('title')} ({totalComments})
      </h3>

      <div className="space-y-4 mb-8">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} onReply={setReplyTo} onLike={handleLike} replyTo={replyTo} />
        ))}
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">{t('empty')}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-4 space-y-3">
        <h4 className="font-bold text-gray-900 text-sm">
          {replyTo ? t('replyTitle') : t('commentTitle')}
          {replyTo && <button type="button" onClick={() => setReplyTo(null)} className="mr-2 text-xs text-gray-400 hover:text-gray-600">{t('cancelReply')}</button>}
        </h4>
        {session?.user?.name && (
          <p className="text-xs text-gray-500">{t('commentingAs')} <span className="font-medium text-gray-700">{session.user.name}</span></p>
        )}
        <textarea
          value={content} onChange={e => setContent(e.target.value)}
          placeholder={t('placeholder')} required rows={3}
          className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
        />
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 bg-[#1a5632] hover:bg-[#0f3d23] text-white px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" /> {loading ? t('sending') : replyTo ? t('sendReply') : t('sendComment')}
        </button>
      </form>
    </div>
  );
}

function CommentItem({ comment, onReply, onLike, replyTo }: {
  comment: Comment; onReply: (id: string | null) => void; onLike: (id: string) => void; replyTo: string | null;
}) {
  const t = useTranslations('comments');
  const locale = useLocale();
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-gray-900 text-sm">{comment.author}</span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />{formatDate(comment.createdAt, locale)}
        </span>
      </div>
      <p className="text-gray-700 text-sm">{comment.content}</p>
      <div className="flex items-center gap-3 mt-2">
        <button onClick={() => onLike(comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
          <Heart className="w-3.5 h-3.5" /> {comment.likes}
        </button>
        <button onClick={() => onReply(replyTo === comment.id ? null : comment.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#1a5632] transition-colors">
          <Reply className="w-3.5 h-3.5" /> {t('reply')}
        </button>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mr-6 mt-3 space-y-3 border-r-2 border-gray-200 pr-4">
          {comment.replies.map((r) => (
            <div key={r.id} className="bg-white rounded-lg p-3 border">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-gray-900 text-xs">{r.author}</span>
                <span className="text-[10px] text-gray-400">{formatDate(r.createdAt, locale)}</span>
              </div>
              <p className="text-gray-700 text-sm">{r.content}</p>
              <button onClick={() => onLike(r.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors mt-1">
                <Heart className="w-3 h-3" /> {r.likes}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
