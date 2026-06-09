"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BarChart3, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface Option {
  id: string; text: string; votes: number;
}

interface Survey {
  id: string; title: string; description: string | null;
  options: Option[];
  _count: { votes: number };
}

export function SurveyWidget() {
  const t = useTranslations('survey');
  const { data: session } = useSession();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [voted, setVoted] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/surveys?active=true")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setSurvey(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function vote() {
    if (!selected || !survey) return;
    setMsg("");
    const res = await fetch("/api/surveys/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surveyId: survey.id, optionId: selected }),
    });
    const data = await res.json();
    if (res.ok) {
      setVoted(true);
      const r = await fetch(`/api/surveys/results?surveyId=${survey.id}`);
      if (r.ok) {
        const updated = await r.json();
        setSurvey(updated);
      }
    } else {
      setMsg(data.error || t('error'));
    }
  }

  if (loading) return null;
  if (!survey) return null;

  const totalVotes = survey._count.votes;
  const userVoted = voted;

  return (
    <div className="bg-white rounded-2xl border p-5">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-5 h-5 text-[#1a5632]" />
        <h3 className="font-bold text-gray-900 text-sm">{t('title')}</h3>
      </div>
      <h4 className="font-bold text-gray-900 mb-1">{survey.title}</h4>
      {survey.description && <p className="text-xs text-gray-500 mb-4">{survey.description}</p>}

      <div className={`space-y-2 ${userVoted ? "" : ""}`}>
        {survey.options.map(opt => {
          const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          return (
            <div key={opt.id}>
              {userVoted || totalVotes > 0 ? (
                <div className="text-sm">
                  <div className="flex justify-between mb-0.5">
                    <span className="text-gray-700">{opt.text}</span>
                    <span className="text-gray-400 text-xs">{opt.votes} ({pct}%)</span>
                  </div>
                  <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1a5632] rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ) : (
                <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors text-sm ${selected === opt.id ? "border-[#1a5632] bg-green-50" : "hover:bg-gray-50"}`}>
                  <input type="radio" name="survey" value={opt.id} onChange={e => setSelected(e.target.value)} className="accent-[#1a5632]" />
                  {opt.text}
                </label>
              )}
            </div>
          );
        })}
      </div>

      {!session && !userVoted && (
        <p className="text-xs text-gray-400 mt-3">{t('loginToVote')}</p>
      )}

      {session && !userVoted && totalVotes === 0 && (
        <>
          {msg && <p className="text-xs text-red-500 mt-2">{msg}</p>}
          <button onClick={vote} disabled={!selected} className="mt-3 w-full px-4 py-2 bg-[#1a5632] text-white rounded-xl text-sm hover:bg-[#0f3d23] transition-colors disabled:opacity-50">
            {t('vote')}
          </button>
        </>
      )}

      {userVoted && (
        <div className="flex items-center gap-1 mt-3 text-xs text-green-600">
          <CheckCircle className="w-3.5 h-3.5" /> {t('votedSuccess')}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-2">{t('totalVotes', { totalVotes })}</p>
    </div>
  );
}
