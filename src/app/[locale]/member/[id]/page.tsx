"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import {
  Loader2, MapPin, User, Calendar, Briefcase,
  GraduationCap, Heart, Wrench, BadgeCheck,
  CreditCard, ExternalLink, FileText
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/date";
import { TopBar } from "@/components/home/top-bar";
import { SiteHeader } from "@/components/home/site-header";

interface MemberProfile {
  id: string; memberNumber?: number | null;
  nameAr: string; nameNl: string;
  birthYear: number; gender: string;
  originCity: string; nlProvincie: string; nlCity: string;
  expNl: string | null; expOutside: string | null;
  educationLevel: string | null;
  profession: string | null;
  skills: string | null;
  maritalStatus: string | null;
  isCvPublic?: boolean | null;
  createdAt: string;
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
      <div className="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
        <Icon className="w-3.5 h-3.5" />
        <span className="uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="font-bold text-slate-800 text-sm">{value}</p>
    </div>
  );
}

export default function MemberPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("memberPublic");
  const locale = useLocale();
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/member/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setMember(data);
        else setError(true);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div dir="auto" className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
        <TopBar /><SiteHeader />
        <main className="max-w-2xl mx-auto px-4 py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
        </main>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div dir="auto" className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
        <TopBar /><SiteHeader />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-lg font-medium text-slate-500">{t('notFound')}</p>
        </main>
      </div>
    );
  }

  const memberNum = member.memberNumber ? String(member.memberNumber).padStart(6, '0') : null;

  return (
    <div dir="auto" className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <TopBar />
      <SiteHeader />
      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Hero card */}
        <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 rounded-3xl overflow-hidden shadow-xl mb-6">

          {/* bg pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)`
            }}
          />
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-emerald-400/10 blur-2xl" />

          <div className="relative z-10 p-8 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-white text-4xl font-black mb-4 shadow-lg">
              {member.nameAr.charAt(0)}
            </div>

            <h1 className="text-2xl font-black text-white mb-1">{member.nameAr}</h1>
            <p className="text-emerald-300 text-sm mb-3" dir="ltr">{member.nameNl}</p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs text-emerald-300 font-bold">
                <BadgeCheck className="w-3.5 h-3.5" />
                {t('memberBadge')}
              </span>
              {memberNum && (
                <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-400/30 rounded-full text-xs text-yellow-300 font-mono font-bold">
                  #{memberNum}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              <Link
                href={`/membership-card/${member.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-sm font-bold transition-all hover:scale-105"
              >
                <CreditCard className="w-4 h-4" />
                {t('viewCard')}
                <ExternalLink className="w-3 h-3 opacity-60" />
              </Link>
              {member.isCvPublic && (
                <a
                  href={`/api/members/${member.id}/pdf`}
                  download
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700/80 hover:bg-emerald-700 border border-emerald-600/50 text-white rounded-xl text-sm font-bold transition-all hover:scale-105 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  {t('downloadCvPdf') || "Download CV (PDF)"}
                </a>
              )}
            </div>
          </div>

          {/* bottom colored strip */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500/60 via-emerald-400/80 to-yellow-500/60" />
        </div>

        {/* Info grid */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoCard icon={MapPin} label={t('originCity')} value={member.originCity} />
            <InfoCard icon={MapPin} label={t('residence')} value={`${member.nlCity} — ${member.nlProvincie}`} />
            <InfoCard icon={Calendar} label={t('birthYear')} value={String(member.birthYear)} />
            <InfoCard icon={User} label={t('gender')} value={member.gender} />
            {member.educationLevel && (
              <InfoCard icon={GraduationCap} label={t('educationLevel')} value={member.educationLevel} />
            )}
            {member.maritalStatus && (
              <InfoCard icon={Heart} label={t('maritalStatus')} value={member.maritalStatus} />
            )}
            {member.profession && (
              <InfoCard icon={Briefcase} label={t('profession')} value={member.profession} />
            )}
            {member.skills && (
              <InfoCard icon={Wrench} label={t('skills')} value={member.skills} />
            )}
          </div>

          {/* Experience sections */}
          {member.expNl && (
            <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700 text-xs mb-2">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider font-bold">{t('expNl')}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{member.expNl}</p>
            </div>
          )}

          {member.expOutside && (
            <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider font-bold">{t('expOutside')}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{member.expOutside}</p>
            </div>
          )}

          <p className="text-center text-xs text-slate-400 mt-6 pb-1">
            {t('memberSince')} {formatDate(member.createdAt, locale)}
          </p>
        </div>
      </main>
    </div>
  );
}
