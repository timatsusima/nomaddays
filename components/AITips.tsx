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

  useEffect(() => {
    const profile = {
      citizenship: localStorage.getItem('nomaddays_citizenship') || undefined,
      residenceCountry: localStorage.getItem('nomaddays_residence') || undefined,
      residencePermitType: localStorage.getItem('nomaddays_permit_type') || undefined,
      residencePermitStart: localStorage.getItem('nomaddays_permit_start') || undefined,
      residencePermitEnd: localStorage.getItem('nomaddays_permit_end') || undefined,
    };
    (async () => {
      try {
        const res = await fetch('/api/ai/tips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile, trips })
        });
        const data = await res.json();
        setState({ tips: data.tips || [], loading: false });
      } catch {
        setState({ tips: [], loading: false });
      }
    })();
  }, [trips]);

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
      </div>
    </div>
  );
}


