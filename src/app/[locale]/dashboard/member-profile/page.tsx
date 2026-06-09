"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, Save, User, Phone, MapPin, Mail, BadgeCheck, Clock, XCircle, Eye, Pencil, Camera, Badge, EyeOff } from "lucide-react";
import { Link } from "@/i18n/routing";

interface MemberData {
  id: string; memberNumber?: number | null;
  nameAr: string; nameNl: string; birthYear: number;
  gender: string; originCity: string; whatsapp: string; email: string | null;
  avatar?: string | null;
  nlProvincie: string; nlCity: string; expNl: string | null; expOutside: string | null;
  educationLevel: string | null; profession: string | null; skills: string | null; maritalStatus: string | null;
  status: string | null; notes: string | null; showInPublicProfile?: boolean | null;
  createdAt: string;
}

const SYRIAN_GOVERNORATES = [
  "دمشق", "ريف دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس",
  "إدلب", "دير الزور", "الرقة", "الحسكة", "درعا", "السويداء", "القنيطرة",
];
const NL_PROVINCES = [
  "Zuid-Holland", "Noord-Holland", "Utrecht", "Gelderland", "Noord-Brabant",
  "Overijssel", "Flevoland", "Groningen", "Friesland", "Drenthe", "Zeeland", "Limburg",
];

const STATUS_MAP: Record<string, { color: string; icon: any }> = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  accepted: { color: "bg-emerald-100 text-emerald-800", icon: BadgeCheck },
  rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function MemberProfilePage() {
  const t = useTranslations('dashboard.memberProfilePage');
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (!session?.user?.id) return;
    fetch("/api/member/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.member) {
          setMember(d.member);
          setForm({
            nameAr: d.member.nameAr, nameNl: d.member.nameNl,
            birthYear: d.member.birthYear, gender: d.member.gender,
            originCity: d.member.originCity, whatsapp: d.member.whatsapp,
            email: d.member.email || "", nlProvincie: d.member.nlProvincie,
            nlCity: d.member.nlCity, expNl: d.member.expNl || "",
            expOutside: d.member.expOutside || "",
            educationLevel: d.member.educationLevel || "",
            profession: d.member.profession || "",
            skills: d.member.skills || "",
            maritalStatus: d.member.maritalStatus || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session, sessionStatus, router]);

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-800" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-20">
        <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">{t('noApplication')}</h2>
        <p className="text-gray-500 mb-4">{t('noApplicationDesc')}</p>
        <Link href="/join" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-xl font-bold hover:bg-emerald-900 transition">
          {t('submitApplication')}
        </Link>
      </div>
    );
  }

  const statusKey = member.status || "pending";
  const st = STATUS_MAP[statusKey];
  const StatusIcon = st.icon;
  const statusLabel = t(statusKey);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/member/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok && data?.member) {
      setMember(data.member);
      setEditing(false);
      setMsg(t('savedSuccess'));
    } else {
      setMsg(data?.error || t('saveError'));
    }
    setSaving(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg === t('saveError') ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
          {msg}
        </div>
      )}

      <div className="bg-white rounded-2xl border p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-emerald-800" />
            <h1 className="text-xl font-bold text-gray-900">{t('sectionTitle')}</h1>
          </div>
          {member.status === "pending" && !editing && (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition">
              <Pencil className="w-4 h-4" /> {t('editBtn')}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6 pb-6 border-b">
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 rounded-full bg-emerald-800 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {member.avatar ? (
                <img src={member.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                member.nameAr.charAt(0)
              )}
            </div>
            <button onClick={() => document.getElementById("avatarInput")?.click()} className="absolute -bottom-1 -left-1 w-6 h-6 bg-white border rounded-full flex items-center justify-center text-gray-500 hover:text-emerald-700 transition shadow-sm">
              <Camera className="w-3.5 h-3.5" />
            </button>
            {member.avatar && (
              <button onClick={async () => {
                const res = await fetch("/api/member/avatar", { method: "DELETE" });
                if (res.ok) setMember({ ...member, avatar: null });
              }} className="absolute -top-1 -right-1 w-5 h-5 bg-red-100 border border-red-200 rounded-full flex items-center justify-center text-red-500 hover:bg-red-200 transition shadow-sm text-[10px]">
                ✕
              </button>
            )}
            <input id="avatarInput" type="file" accept="image/*" className="hidden" onChange={async e => {
              const file = e.target.files?.[0]; if (!file) return;
              const fd = new FormData(); fd.append("file", file);
              const res = await fetch("/api/member/avatar", { method: "POST", body: fd });
              const data = await res.json();
              if (res.ok) setMember({ ...member, avatar: data.url });
            }} />
          </div>
          <div>
            <p className="font-bold text-gray-900">{member.nameAr}</p>
            <p className="text-sm text-gray-400" dir="ltr">{member.nameNl}</p>
            {member.memberNumber && (
              <span className="inline-flex items-center gap-1 mt-1 text-xs text-gray-500">
                <Badge className="w-3 h-3" /> {t('memberNumber')}{member.memberNumber}
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 mt-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${st.color}`}>
              <StatusIcon className="w-3.5 h-3.5" /> {statusLabel}
            </span>
          </div>
          {member.status === "accepted" && (
            <Link href={`/member/${member.id}`} className="mr-auto flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-sm font-medium transition">
              <Eye className="w-4 h-4" /> {t('viewPublicProfile')}
            </Link>
          )}
        </div>

        {member.notes && (
          <div className="mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <p className="text-sm font-bold text-orange-800 mb-1">{t('adminNotes')}</p>
            <p className="text-sm text-orange-700">{member.notes}</p>
          </div>
        )}

        {!editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t('nameAr')} value={member.nameAr} icon={User} />
            <Field label={t('nameNl')} value={member.nameNl} icon={User} />
            <Field label={t('birthYear')} value={String(member.birthYear)} icon={User} />
            <Field label={t('gender')} value={member.gender} icon={User} />
            <Field label={t('originCity')} value={member.originCity} icon={MapPin} />
            <Field label={t('whatsapp')} value={member.whatsapp} icon={Phone} />
            {member.email && <Field label={t('email')} value={member.email} icon={Mail} />}
            <Field label={t('nlProvincie')} value={member.nlProvincie} icon={MapPin} />
            <Field label={t('nlCity')} value={member.nlCity} icon={MapPin} />
            {member.educationLevel && <Field label={t('educationLevel')} value={member.educationLevel} icon={User} />}
            {member.profession && <Field label={t('profession')} value={member.profession} icon={User} />}
            {member.skills && <Field label={t('skills')} value={member.skills} icon={User} />}
            {member.maritalStatus && <Field label={t('maritalStatus')} value={member.maritalStatus} icon={User} />}
            {member.expNl && (
              <div className="sm:col-span-2">
                <Field label={t('expNl')} value={member.expNl} icon={User} />
              </div>
            )}
            {member.expOutside && (
              <div className="sm:col-span-2">
                <Field label={t('expOutside')} value={member.expOutside} icon={User} />
              </div>
            )}
            <div className="sm:col-span-2 text-xs text-gray-400 pt-4 border-t mt-2 space-y-1">
              <span>{t('appliedDate')}{new Date(member.createdAt).toLocaleDateString("ar")}</span>
              {member.status === "accepted" && (
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={async () => {
                    const val = !(member.showInPublicProfile ?? true);
                    const res = await fetch("/api/member/me", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ showInPublicProfile: val }),
                    });
                    if (res.ok) setMember({ ...member, showInPublicProfile: val });
                  }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${member.showInPublicProfile !== false ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {member.showInPublicProfile !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {member.showInPublicProfile !== false ? t('profileVisible') : t('profileHidden')}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label={t('nameAr')} value={form.nameAr} onChange={v => setForm({...form, nameAr: v})} required />
              <Input label={t('nameNl')} value={form.nameNl} onChange={v => setForm({...form, nameNl: v})} required dir="ltr" />
              <Input label={t('birthYear')} type="number" value={form.birthYear} onChange={v => setForm({...form, birthYear: v})} required />
              <Select label={t('gender')} value={form.gender} onChange={v => setForm({...form, gender: v})} options={[t('male'), t('female')]} required />
              <Select label={t('originCity')} value={form.originCity} onChange={v => setForm({...form, originCity: v})} options={SYRIAN_GOVERNORATES} required />
              <Input label={t('whatsapp')} value={form.whatsapp} onChange={v => setForm({...form, whatsapp: v})} required dir="ltr" />
              <Input label={t('email')} type="email" value={form.email} onChange={v => setForm({...form, email: v})} dir="ltr" />
              <Select label={t('nlProvincie')} value={form.nlProvincie} onChange={v => setForm({...form, nlProvincie: v})} options={NL_PROVINCES} required />
              <Input label={t('nlCity')} value={form.nlCity} onChange={v => setForm({...form, nlCity: v})} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label={t('educationLevel')} value={form.educationLevel} onChange={v => setForm({...form, educationLevel: v})} options={[t('illiterate'), t('primary'), t('middle'), t('secondary'), t('intermediateInstitute'), t('university'), t('postgraduate')]} />
              <Input label={t('profession')} value={form.profession} onChange={v => setForm({...form, profession: v})} />
              <Input label={t('skills')} value={form.skills} onChange={v => setForm({...form, skills: v})} />
              <Select label={t('maritalStatus')} value={form.maritalStatus} onChange={v => setForm({...form, maritalStatus: v})} options={[t('single'), t('married'), t('divorced'), t('widowed')]} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('expNl')}</label>
              <textarea value={form.expNl} onChange={e => setForm({...form, expNl: e.target.value})} className="w-full border rounded-xl px-4 py-2.5 text-sm h-24 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('expOutside')}</label>
              <textarea value={form.expOutside} onChange={e => setForm({...form, expOutside: e.target.value})} className="w-full border rounded-xl px-4 py-2.5 text-sm h-24 resize-none" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-800 text-white rounded-xl text-sm font-bold hover:bg-emerald-900 transition disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? t('saving') : t('saveChanges')}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                {t('cancel')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="p-4 bg-gray-50 rounded-2xl">
      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <p className="font-bold text-gray-900 text-sm">{value}</p>
    </div>
  );
}

function Input({ label, value, onChange, required, dir, type }: { label: string; value: any; onChange: (v: string) => void; required?: boolean; dir?: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type || "text"} value={value} onChange={e => onChange(e.target.value)} required={required} dir={dir || "auto"}
        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600" />
    </div>
  );
}

function Select({ label, value, onChange, options, required }: { label: string; value: any; onChange: (v: string) => void; options: string[]; required?: boolean }) {
  const t = useTranslations("dashboard.memberProfilePage");
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} required={required}
        className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600">
        <option value="">{t('choose')}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
