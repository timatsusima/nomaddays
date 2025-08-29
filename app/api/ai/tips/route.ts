import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, trips } = body as {
      profile: {
        citizenship?: string;
        residenceCountry?: string;
        residencePermitType?: string;
        residencePermitStart?: string;
        residencePermitEnd?: string;
      };
      trips: Array<{ countryCode: string; entryDate: string; exitDate: string }>;
    };

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ tips: [
        'Сделайте резервную копию данных поездок (CSV) и держите локальную копию.',
        'Добавьте страну ВНЖ/РВП в онбординге — тогда появятся лимиты и подсказки.',
        'Проверьте планировщиком длительные поездки (>60 дней) перед покупкой билетов.'
      ] });
    }

    const openai = new OpenAI({ apiKey });
    const system = `Ты — помощник цифровых кочевников. Дай 3–5 кратких, практичных подсказок на русском.
Учитывай гражданство, страну резиденции (РВП/ВНЖ), даты действия статуса, список поездок (ISO даты) за 12 мес.
Фокус: соблюдение лимитов (например, 90/180, 183/365, дни вне страны), риски продления статуса, необходимость буферов по датам.
Верни строго JSON вида {"tips": ["...","..."]}. Без префиксов/пояснений.`;

    const user = JSON.stringify({ profile, trips });
    const rsp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    });
    const text = rsp.choices?.[0]?.message?.content ?? '{}';
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed?.tips)) {
        return NextResponse.json({ tips: parsed.tips.slice(0, 5) });
      }
    } catch {}
    return NextResponse.json({ tips: [
      'Добавьте/уточните страну ВНЖ/РВП и сроки — это улучшит расчёты.',
      'Используйте планировщик: проверьте длинные поездки против лимитов (90/180, 183/365).',
      'Держите буфер 7–10 дней до истечения лимитов, чтобы избежать нарушений.'
    ] });
  } catch (e) {
    return NextResponse.json({ tips: [
      'Не удалось получить подсказки ИИ. Проверьте соединение и повторите попытку позже.'
    ] }, { status: 200 });
  }
}


