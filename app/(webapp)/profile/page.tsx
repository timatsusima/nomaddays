'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';

interface ProfileData {
  residencePermitType?: 'РВП' | 'ВНЖ' | '';
  permitStart?: string;
  permitEnd?: string;
  passportNumber?: string;
  inn?: string;
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData>({
    residencePermitType: '',
    permitStart: '',
    permitEnd: '',
    passportNumber: '',
    inn: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nomaddays_profile');
      if (saved) setData(JSON.parse(saved));
    }
  }, []);

  const save = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nomaddays_profile', JSON.stringify(data));
      alert('Профиль сохранён');
    }
  };

  return (
    <div className="tg-webapp min-h-screen bg-[var(--surface)] pb-24">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Профиль</h1>
        <p className="text-[var(--text-secondary)] mb-6">Личные данные и документы</p>

        <div className="card mb-4">
          <div className="card-title">Резидентский статус</div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Тип</label>
              <select
                className="form-input"
                value={data.residencePermitType}
                onChange={(e) => setData({ ...data, residencePermitType: e.target.value as any })}
              >
                <option value="">Не задано</option>
                <option value="РВП">РВП</option>
                <option value="ВНЖ">ВНЖ</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Дата начала</label>
                <input type="date" className="form-input" value={data.permitStart || ''} onChange={(e) => setData({ ...data, permitStart: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm mb-1">Дата окончания</label>
                <input type="date" className="form-input" value={data.permitEnd || ''} onChange={(e) => setData({ ...data, permitEnd: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-title">Паспорт и ИНН</div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Загранпаспорт (номер)</label>
              <input type="text" className="form-input" placeholder="№" value={data.passportNumber || ''} onChange={(e) => setData({ ...data, passportNumber: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm mb-1">ИНН</label>
              <input type="text" className="form-input" placeholder="ИНН" value={data.inn || ''} onChange={(e) => setData({ ...data, inn: e.target.value })} />
            </div>
          </div>
        </div>

        <button className="btn" onClick={save}>Сохранить</button>
      </div>
      <Navigation />
    </div>
  );
}
