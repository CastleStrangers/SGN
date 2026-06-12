"use client";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Calendar, MapPin, Clock, Check } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/date";
import { useSession } from "next-auth/react";

interface Event { id: string; title: string; description: string | null; date: string; location: string | null; image: string | null; category: string; }

export default function EventsPage() {
  const t = useTranslations('events');
  const locale = useLocale();
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/events?upcoming=true")
      .then(r => r.json())
      .then(data => { setEvents(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (session) {
      fetch("/api/events/register")
        .then(r => r.ok ? r.json() : [])
        .then((data: any[]) => {
          setRegisteredIds(new Set(data.map(r => r.eventId)));
        })
        .catch(() => {});
    }
  }, [session]);

  const categoryColors: Record<string, string> = {
    "فعالية": "bg-green-100 text-green-700",
    "اجتماع": "bg-blue-100 text-blue-700",
    "ورشة عمل": "bg-amber-100 text-amber-700",
    "محاضرة": "bg-purple-100 text-purple-700",
    "احتفال": "bg-red-100 text-red-700",
  };

  const categoryLabels: Record<string, string> = {
    "فعالية": t('categoryEvent'),
    "اجتماع": t('categoryMeeting'),
    "ورشة عمل": t('categoryWorkshop'),
    "محاضرة": t('categoryLecture'),
    "احتفال": t('categoryCelebration'),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-l from-[#1a5632] to-[#0f3d23] text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToHome')}</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Calendar className="w-8 h-8 text-[#c8a84e]" /> {t('title')}
          </h1>
          <p className="text-white/70 mt-2 max-w-2xl">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-[#1a5632] border-t-transparent rounded-full" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('empty')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-16 h-16 bg-[#1a5632] text-white rounded-xl flex flex-col items-center justify-center">
                      <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
                      <span className="text-xs">{formatDate(event.date, locale, { month: "short" })}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${categoryColors[event.category] || "bg-gray-100 text-gray-700"}`}>
                          {categoryLabels[event.category] || event.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                      {event.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>}
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDate(event.date, locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                        {event.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.location}</span>}
                      </div>
                      {session && (
                        <div className="mt-4 border-t pt-3 flex justify-end">
                          {registeredIds.has(event.id) ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                              <Check className="w-3.5 h-3.5" /> {t('registered')}
                            </span>
                          ) : (
                            <button
                              onClick={async () => {
                                const res = await fetch("/api/events/register", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ eventId: event.id }),
                                });
                                if (res.ok) {
                                  setRegisteredIds(new Set([...registeredIds, event.id]));
                                } else {
                                  const data = await res.json();
                                  alert(data.error || t('registerFailed'));
                                }
                              }}
                              className="px-4 py-1.5 bg-[#1a5632] hover:bg-[#0f3d23] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              {t('rsvpBtn')}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
