"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, MapPin, User, Calendar, Briefcase, GraduationCap, Heart, Wrench, Badge, Camera } from "lucide-react";
import { useTranslations } from "next-intl";
import { TopBar } from "@/components/home/top-bar";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";

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
  createdAt: string;
}

export default function MemberPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("memberPublic");
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
      <div dir="auto" className="min-h-screen bg-gray-50">
        <TopBar /><SiteHeader />
        <main className="max-w-2xl mx-auto px-4 py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-800" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div dir="auto" className="min-h-screen bg-gray-50">
        <TopBar /><SiteHeader />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-500">{t('notFound')}</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div dir="auto" className="min-h-screen bg-gray-50">
      <TopBar />
      <SiteHeader />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border p-6 md:p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-emerald-800 flex items-center justify-center text-white text-3xl font-bold mb-4 overflow-hidden">
              {member.memberNumber && <img src="/api/placeholder" alt="" className="hidden" />}
              <span>{member.nameAr.charAt(0)}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{member.nameAr}</h1>
            <p className="text-gray-500 mt-1" dir="ltr">{member.nameNl}</p>
            {member.memberNumber && (
              <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Badge className="w-3 h-3" /> {t('memberNumber')}: {member.memberNumber}
              </span>
            )}
            <span className="mt-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">{t('memberBadge')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <MapPin className="w-3 h-3" />
                <span>{t('originCity')}</span>
              </div>
              <p className="font-bold text-gray-900">{member.originCity}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <MapPin className="w-3 h-3" />
                <span>{t('residence')}</span>
              </div>
              <p className="font-bold text-gray-900">{member.nlCity} — {member.nlProvincie}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <Calendar className="w-3 h-3" />
                <span>{t('birthYear')}</span>
              </div>
              <p className="font-bold text-gray-900">{member.birthYear}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <User className="w-3 h-3" />
                <span>{t('gender')}</span>
              </div>
              <p className="font-bold text-gray-900">{member.gender}</p>
            </div>
          </div>

          {member.educationLevel && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <GraduationCap className="w-3 h-3" />
                  <span>{t('educationLevel')}</span>
                </div>
                <p className="font-bold text-gray-900">{member.educationLevel}</p>
              </div>
              {member.maritalStatus && (
              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <Heart className="w-3 h-3" />
                  <span>{t('maritalStatus')}</span>
                </div>
                <p className="font-bold text-gray-900">{member.maritalStatus}</p>
              </div>
              )}
            </div>
          )}
          {member.profession && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <Briefcase className="w-3 h-3" />
                  <span>{t('profession')}</span>
                </div>
                <p className="font-bold text-gray-900">{member.profession}</p>
              </div>
              {member.skills && (
              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <Wrench className="w-3 h-3" />
                  <span>{t('skills')}</span>
                </div>
                <p className="font-bold text-gray-900">{member.skills}</p>
              </div>
              )}
            </div>
          )}
          {member.expNl && (
            <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                <Briefcase className="w-3 h-3" />
                <span>{t('expNl')}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{member.expNl}</p>
            </div>
          )}

          {member.expOutside && (
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                <Briefcase className="w-3 h-3" />
                <span>{t('expOutside')}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{member.expOutside}</p>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-8">
            {t('memberSince')} {new Date(member.createdAt).toLocaleDateString("ar")}
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
