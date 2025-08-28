export interface LLMForecastRequest {
  userProfile: {
    citizenship: string;
    residenceCountry: string;
    residencePermitType?: 'RVP' | 'VNZH' | 'NONE';
    residencePermitStart?: string;
    residencePermitEnd?: string;
  };
  trips: Array<{ countryCode: string; entryDate: string; exitDate: string }>;
  plannedTrip?: { countryCode?: string; start: string; end: string };
}

export async function computeForecastWithLLM(req: LLMForecastRequest): Promise<any> {
  const apiKey = localStorage.getItem('nomaddays_openai_api_key');
  if (!apiKey) throw new Error('OpenAI API key not set');

  const prompt = `You are an expert assistant for digital nomads. Given the user's citizenship, residence permit (RVP/VNZH) with validity dates, full trip history, and a planned trip, analyze compliance with relevant residency rules (e.g., Kazakhstan 183 days in country rule, Schengen 90/180, and other common nomad rules). Provide a concise JSON with fields: canTravel (boolean), results: [{ruleKey, ruleName, isCompliant, usedDays, availableDays, severity, explanation}]. Use current and accurate laws. Dates are in ISO.`;

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: JSON.stringify(req) }
    ]
  } as const;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error('OpenAI API error');
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '{}';
  try {
    return JSON.parse(text);
  } catch {
    return { canTravel: true, results: [] };
  }
}


