"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { MapPin, Clock, Calendar, AlertCircle } from "lucide-react";

interface Timings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const CITIES = [
  { id: "amsterdam", name: "Amsterdam", apiName: "Amsterdam" },
  { id: "rotterdam", name: "Rotterdam", apiName: "Rotterdam" },
  { id: "hague", name: "The Hague", apiName: "The Hague" },
  { id: "utrecht", name: "Utrecht", apiName: "Utrecht" },
  { id: "eindhoven", name: "Eindhoven", apiName: "Eindhoven" },
  { id: "groningen", name: "Groningen", apiName: "Groningen" },
  { id: "enschede", name: "Enschede", apiName: "Enschede" },
];

export function PrayerTimesWidget() {
  const t = useTranslations("sidebar.prayerTimes");
  const locale = useLocale();
  
  const [selectedCity, setSelectedCity] = useState("amsterdam");
  const [timings, setTimings] = useState<Timings | null>(null);
  const [hijriDate, setHijriDate] = useState<string | null>(null);
  const [weekday, setWeekday] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nextPrayerKey, setNextPrayerKey] = useState<string | null>(null);

  useEffect(() => {
    const activeCity = CITIES.find((c) => c.id === selectedCity) || CITIES[0];
    setLoading(true);
    setError(false);

    fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
        activeCity.apiName
      )}&country=Netherlands&method=3`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((payload) => {
        if (payload.code === 200 && payload.data) {
          const { timings: apiTimings, date } = payload.data;
          setTimings(apiTimings);
          
          // Localize Hijri date
          const hijri = date.hijri;
          const monthName = locale === "ar" ? hijri.month.ar : hijri.month.en;
          setHijriDate(`${hijri.day} ${monthName} ${hijri.year} هـ`);
          
          const dayName = locale === "ar" ? hijri.weekday.ar : hijri.weekday.en;
          setWeekday(dayName);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [selectedCity, locale]);

  // Determine the next prayer
  useEffect(() => {
    if (!timings) return;

    const timer = setInterval(() => {
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();

      const timeToMins = (timeStr: string) => {
        const [h, m] = timeStr.split(":").map(Number);
        return h * 60 + m;
      };

      const prayerTimes = [
        { key: "fajr", mins: timeToMins(timings.Fajr) },
        { key: "sunrise", mins: timeToMins(timings.Sunrise) },
        { key: "dhuhr", mins: timeToMins(timings.Dhuhr) },
        { key: "asr", mins: timeToMins(timings.Asr) },
        { key: "maghrib", mins: timeToMins(timings.Maghrib) },
        { key: "isha", mins: timeToMins(timings.Isha) },
      ];

      // Find the first prayer that is later than now
      let next = prayerTimes.find((p) => p.mins > nowMins);
      if (!next) {
        // If all prayers today have passed, the next one is Fajr tomorrow
        next = prayerTimes[0];
      }

      setNextPrayerKey(next.key);
    }, 1000);

    return () => clearInterval(timer);
  }, [timings]);

  const pKeys = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;
  
  const getTimingVal = (key: typeof pKeys[number]): string => {
    if (!timings) return "";
    switch (key) {
      case "fajr": return timings.Fajr;
      case "sunrise": return timings.Sunrise;
      case "dhuhr": return timings.Dhuhr;
      case "asr": return timings.Asr;
      case "maghrib": return timings.Maghrib;
      case "isha": return timings.Isha;
    }
  };

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
      {/* Header Banner */}
      <div className="bg-[#1a5632] text-white px-5 py-4 flex items-center justify-between">
        <h4 className="font-bold text-sm flex items-center gap-2">
          <Clock className="w-4.5 h-4.5 text-[#c8a84e] animate-pulse" />
          <span>{t("title")}</span>
        </h4>
        
        {/* City Select */}
        <div className="relative flex items-center bg-white/10 hover:bg-white/20 text-white rounded-xl px-2.5 py-1.5 transition-colors text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5 text-[#c8a84e] mr-1 ml-1" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-transparent border-none text-white focus:outline-none focus:ring-0 cursor-pointer pl-1 pr-1 font-sans"
            style={{ colorScheme: "dark" }}
          >
            {CITIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#113d22] text-white">
                {t(`cities.${c.id}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="animate-spin w-8 h-8 border-3 border-[#1a5632] border-t-transparent rounded-full" />
          <p className="text-xs text-gray-400">{t("loading")}</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-2">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-xs text-red-600 font-medium">{t("error")}</p>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* Hijri & Weekday Info */}
          {hijriDate && (
            <div className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs text-gray-500 font-medium shadow-sm">
              <Calendar className="w-4 h-4 text-[#1a5632]" />
              <span>
                {weekday ? `${weekday}، ` : ""}
                {hijriDate}
              </span>
            </div>
          )}

          {/* Timings List */}
          <div className="space-y-1.5">
            {pKeys.map((key) => {
              const isNext = nextPrayerKey === key;
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${
                    isNext
                      ? "bg-gradient-to-r from-[#1a5632]/5 to-[#1a5632]/10 border-[#1a5632]/30 shadow-sm"
                      : "bg-white border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-semibold ${
                        isNext ? "text-[#1a5632] font-bold" : "text-gray-700"
                      }`}
                    >
                      {t(key)}
                    </span>
                    {isNext && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c8a84e]/20 text-[#c8a84e] border border-[#c8a84e]/30 animate-pulse">
                        {t("nextPrayer")}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      isNext ? "text-[#1a5632] font-bold" : "text-gray-500"
                    }`}
                  >
                    {getTimingVal(key)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
