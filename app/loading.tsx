'use client';

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

export default function Loading() {
  const [anim, setAnim] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/animation/splash.json')
      .then((r) => r.json())
      .then((json) => mounted && setAnim(json))
      .catch(() => mounted && setAnim(null));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface)] relative">
      <div className="w-56 h-56">
        {anim ? (
          <Lottie animationData={anim} loop autoplay />
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--text)] animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-[var(--text)] animate-bounce [animation-delay:-0.1s]"></div>
            <div className="w-2 h-2 rounded-full bg-[var(--text)] animate-bounce"></div>
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-12 text-center">
        <div className="text-2xl font-bold tracking-wide text-[var(--text)]">NomadDays</div>
      </div>
    </div>
  );
}


