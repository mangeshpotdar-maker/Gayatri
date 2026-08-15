'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Gift, MessageCircle } from 'lucide-react';

interface FestivalGreeting {
  name: string;
  greeting: string;
  subtext: string;
  bgGradient: string;
  textColor: string;
  badgeBg: string;
  icon: string;
}

export default function FestivalBanner() {
  const [currentGreeting, setCurrentGreeting] = useState<FestivalGreeting | null>(null);

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1; // 1-12
    const day = today.getDate(); // 1-31

    let festival: FestivalGreeting | null = null;

    // 15th August - Independence Day
    if (month === 8 && day >= 10 && day <= 17) {
      festival = {
        name: "Independence Day",
        greeting: "🇮🇳 Swatantrata Diwas ki Hardik Shubhkamnaye!",
        subtext: "Celebrating 78 Years of Freedom & Authentic Atmanirbhar Indian Handcrafts.",
        bgGradient: "from-amber-900 via-stone-900 to-emerald-950",
        textColor: "text-amber-100",
        badgeBg: "bg-amber-800/80 border-amber-600/60 text-amber-200",
        icon: "✨"
      };
    }
    // 2nd October - Gandhi Jayanti
    else if (month === 10 && day >= 1 && day <= 3) {
      festival = {
        name: "Gandhi Jayanti",
        greeting: "🕊️ Happy Gandhi Jayanti — Honoring Khadi & Traditional Indian Artisans",
        subtext: "Empowering local Jaipur craft makers through sustainable handmade art.",
        bgGradient: "from-amber-950 via-stone-900 to-amber-900",
        textColor: "text-amber-100",
        badgeBg: "bg-amber-800/80 border-amber-600/60 text-amber-200",
        icon: "🙏"
      };
    }
    // 14th November - Children's Day
    else if (month === 11 && day >= 12 && day <= 16) {
      festival = {
        name: "Children's Day",
        greeting: "🎨 Happy Children's Day — Inspire Young Minds with Handmade Art & Creativity!",
        subtext: "Special gift packages on DIY art kits & hand-painted decor for kids.",
        bgGradient: "from-orange-950 via-stone-900 to-amber-900",
        textColor: "text-amber-100",
        badgeBg: "bg-amber-800/80 border-amber-600/60 text-amber-200",
        icon: "🎈"
      };
    }
    // 26th January - Republic Day
    else if (month === 1 && day >= 22 && day <= 28) {
      festival = {
        name: "Republic Day",
        greeting: "🇮🇳 Happy Republic Day — Celebrating Indian Heritage & Cultural Art",
        subtext: "Honor Indian traditions with Lippan mirror work & canvas paintings.",
        bgGradient: "from-amber-900 via-stone-900 to-emerald-950",
        textColor: "text-amber-100",
        badgeBg: "bg-amber-800/80 border-amber-600/60 text-amber-200",
        icon: "✨"
      };
    }
    // Festive Default (Diwali / Festive Season for all other dates)
    else {
      festival = {
        name: "Festive Season",
        greeting: "✨ Celebrate Indian Festivals with Handcrafted Treasures from Jaipur",
        subtext: "Authentic Lippan mirrors, gold leaf canvas paintings & organic soy candles.",
        bgGradient: "from-amber-950 via-stone-900 to-amber-900",
        textColor: "text-amber-100",
        badgeBg: "bg-amber-800/80 border-amber-600/60 text-amber-200",
        icon: "🪔"
      };
    }

    setCurrentGreeting(festival);
  }, []);

  if (!currentGreeting) return null;

  return (
    <div className={`bg-gradient-to-r ${currentGreeting.bgGradient} ${currentGreeting.textColor} text-xs py-2.5 px-4 border-b border-amber-500/30 shadow-md`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold font-mono tracking-wider uppercase ${currentGreeting.badgeBg}`}>
            {currentGreeting.icon} {currentGreeting.name} Special
          </span>
          <span className="font-serif font-bold text-sm text-amber-100">
            {currentGreeting.greeting}
          </span>
        </div>

        <p className="text-[11px] text-amber-200/90 font-light flex items-center gap-1">
          <span>{currentGreeting.subtext}</span>
          <span className="hidden lg:inline text-amber-400 font-bold ml-1">Use code WELCOME10 for 10% OFF</span>
        </p>
      </div>
    </div>
  );
}
