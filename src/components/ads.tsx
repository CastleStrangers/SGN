"use client";
import { useEffect, useState } from "react";

interface Ad {
  id: string; title: string; image: string; link: string | null;
  position: string;
}

export function Ads({ position, className = "" }: { position: string; className?: string }) {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    fetch(`/api/ads?active=true&position=${position}`)
      .then(r => r.json())
      .then(data => setAds(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [position]);

  if (ads.length === 0) return null;

  const handleClick = (ad: Ad) => {
    fetch("/api/ads/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ad.id }),
    }).catch(() => {});
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {ads.map(ad => (
        <a
          key={ad.id}
          href={ad.link || "#"}
          target={ad.link ? "_blank" : undefined}
          rel="noopener noreferrer"
          onClick={() => handleClick(ad)}
          className="block group"
        >
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full rounded-xl object-cover transition-opacity group-hover:opacity-90"
            loading="lazy"
          />
        </a>
      ))}
    </div>
  );
}
