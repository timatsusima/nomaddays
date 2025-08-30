import { NextRequest, NextResponse } from 'next/server';

// Expected env vars
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN;
const SUPPORT_CHAT_ID = process.env.TELEGRAM_CHAT_ID; // group/channel/user id

export async function POST(req: NextRequest) {
  try {
    if (!BOT_TOKEN || !SUPPORT_CHAT_ID) {
      return NextResponse.json({ error: 'Server not configured: TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID' }, { status: 500 });
    }

    const contentType = req.headers.get('content-type') || '';

    // Multipart path (file upload)
    if (contentType.includes('multipart/form-data')) {
      const fd = await req.formData();
      const type = (fd.get('type') as string) === 'improve' ? 'improve' : 'issue';
      const message = String(fd.get('message') || '');
      const url = String(fd.get('url') || '');
      const ua = String(fd.get('ua') || '');
      const userJson = String(fd.get('user') || '');
      let user: { id?: number; firstName?: string; lastName?: string; username?: string } | undefined;
      try { user = userJson ? JSON.parse(userJson) : undefined; } catch {}

      const file = fd.get('file') as unknown as File | null;

      const now = new Date();
      const typeLabel = type === 'issue' ? 'Ошибка' : 'Улучшение';
      const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const caption = [
        `<b>n0mad_days • Обратная связь</b>`,
        `Тип: <b>${esc(typeLabel)}</b>`,
        user ? `От: <b>${esc(user.firstName || '')} ${esc(user.lastName || '')}</b> ${user.username ? `(@${esc(user.username)})` : ''} <code>id:${esc(user.id)}</code>` : 'От: <i>аноним</i>',
        '',
        `<b>Сообщение:</b>`,
        esc(message || '(без текста)'),
        '',
        `<b>Метаданные:</b>`,
        `Время: ${now.toISOString()}`,
        url ? `URL: ${esc(url)}` : '',
        ua ? `UA: ${esc(ua)}` : ''
      ].filter(Boolean).join('\n');

      if (!file) {
        // Нет файла — отправим обычным сообщением
        const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const tgRes = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: SUPPORT_CHAT_ID,
            text: caption,
            parse_mode: 'HTML',
            disable_web_page_preview: true
          })
        });
        const tgJson = await tgRes.json();
        if (!tgRes.ok || !tgJson.ok) return NextResponse.json({ error: 'Telegram API error', details: tgJson }, { status: 502 });
        return NextResponse.json({ ok: true });
      }

      // С файлом — решаем, какой метод использовать
      const mime = (file as any).type as string | undefined;
      let method = 'sendDocument';
      let field = 'document';
      if (mime?.startsWith('image/')) { method = 'sendPhoto'; field = 'photo'; }
      else if (mime?.startsWith('video/')) { method = 'sendVideo'; field = 'video'; }

      const tgForm = new FormData();
      tgForm.append('chat_id', SUPPORT_CHAT_ID);
      tgForm.append('caption', caption);
      tgForm.append('parse_mode', 'HTML');
      // @ts-ignore Node18 supports File in FormData
      tgForm.append(field, file, (file as any).name || 'attachment');

      const uploadUrl = `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;
      const upRes = await fetch(uploadUrl, { method: 'POST', body: tgForm });
      const upJson = await upRes.json();
      if (!upRes.ok || !upJson.ok) return NextResponse.json({ error: 'Telegram API error', details: upJson }, { status: 502 });
      return NextResponse.json({ ok: true });
    }

    // JSON path (no file)
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { type, message, user, url, ua } = body as {
      type: 'issue' | 'improve';
      message: string;
      user?: { id?: number; firstName?: string; lastName?: string; username?: string };
      url?: string;
      ua?: string;
    };

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const now = new Date();
    const typeLabel = type === 'issue' ? 'Ошибка' : 'Улучшение';

    // Escape HTML helpers
    const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const text = [
      `<b>n0mad_days • Обратная связь</b>`,
      `Тип: <b>${esc(typeLabel)}</b>`,
      user ? `От: <b>${esc(user.firstName || '')} ${esc(user.lastName || '')}</b> ${user.username ? `(@${esc(user.username)})` : ''} <code>id:${esc(user.id)}</code>` : 'От: <i>аноним</i>',
      '',
      `<b>Сообщение:</b>`,
      esc(message),
      '',
      `<b>Метаданные:</b>`,
      `Время: ${now.toISOString()}`,
      url ? `URL: ${esc(url)}` : '',
      ua ? `UA: ${esc(ua)}` : ''
    ].filter(Boolean).join('\n');

    const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const tgRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: SUPPORT_CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const tgJson = await tgRes.json();
    if (!tgRes.ok || !tgJson.ok) {
      return NextResponse.json({ error: 'Telegram API error', details: tgJson }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal error', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
