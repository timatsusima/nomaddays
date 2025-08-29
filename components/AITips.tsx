'use client';

import { useEffect, useState } from 'react';

interface TipState {
  tips: string[];
  loading: boolean;
}

interface Props {
  trips: Array<{ countryCode: string; entryDate: string; exitDate: string }>;
}

export default function AITips({ trips }: Props) {
  const [state, setState] = useState<TipState>({ tips: [], loading: true });

  const buildProfile = () => ({
    citizenship: localStorage.getItem('nomaddays_citizenship') || undefined,
    residenceCountry: localStorage.getItem('nomaddays_residence') || undefined,
    residencePermitType: localStorage.getItem('nomaddays_permit_type') || undefined,
    residencePermitStart: localStorage.getItem('nomaddays_permit_start') || undefined,
    residencePermitEnd: localStorage.getItem('nomaddays_permit_end') || undefined,
  });

  const hash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return String(h >>> 0);
  };

  const loadTips = async (force = false) => {
    setState((prev) => ({ ...prev, loading: true }));
    const profile = buildProfile();
    const keyPayload = JSON.stringify({ profile, trips });
    const cacheKey = `ai_tips_${hash(keyPayload)}`;
    if (!force) {
      const cached = localStorage.getItem(cacheKey);
      const ts = localStorage.getItem(cacheKey + '_ts');
      if (cached && ts && Date.now() - Number(ts) < 24 * 60 * 60 * 1000) {
        setState({ tips: JSON.parse(cached), loading: false });
        return;
      }
    }
    try {
      const res = await fetch('/api/ai/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, trips })
      });
      const data = await res.json();
      const tips: string[] = data.tips || [];
      setState({ tips, loading: false });
      localStorage.setItem(cacheKey, JSON.stringify(tips));
      localStorage.setItem(cacheKey + '_ts', String(Date.now()));
    } catch {
      setState({ tips: [], loading: false });
    }
  };

  useEffect(() => {
    loadTips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(trips)]);

  return (
    <div className="mb-6 px-4">
      <h2 className="text-lg font-semibold text-[var(--text)] mb-3">Подсказки от ИИ</h2>
      <div className="card">
        {state.loading ? (
          <div className="text-[var(--text-secondary)]">Генерируем рекомендации…</div>
        ) : state.tips.length === 0 ? (
          <div className="text-[var(--text-secondary)]">Пока нет рекомендаций</div>
        ) : (
          <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--text)]">
            {state.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        )}
        <div className="mt-3">
          <button className="btn btn-secondary" onClick={() => loadTips(true)}>Обновить подсказки</button>
        </div>
      </div>
    </div>
  );
}


