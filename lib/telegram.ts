import { createHmac } from 'crypto';

export interface TelegramInitData {
  query_id: string;
  user: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  };
  auth_date: string;
  hash: string;
}

export interface TelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
}

/**
 * Валидирует initData от Telegram WebApp
 */
export function validateInitData(initData: string): TelegramUser | null {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    
    if (!hash) {
      return null;
    }
    
    // Убираем hash из параметров для проверки
    urlParams.delete('hash');
    
    // Сортируем параметры по ключу
    const sortedParams = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    // Создаём секретный ключ
    const secretKey = createHmac('sha256', 'WebAppData')
      .update(process.env.BOT_TOKEN || '')
      .digest();
    
    // Вычисляем хеш
    const calculatedHash = createHmac('sha256', secretKey)
      .update(sortedParams)
      .digest('hex');
    
    // Проверяем хеш
    if (calculatedHash !== hash) {
      return null;
    }
    
    // Извлекаем данные пользователя
    const userData = urlParams.get('user');
    if (!userData) {
      return null;
    }
    
    const userRaw: unknown = JSON.parse(userData);
    if (
      !userRaw ||
      typeof userRaw !== 'object' ||
      !('id' in userRaw) ||
      !('first_name' in userRaw)
    ) {
      return null;
    }

    const u = userRaw as { id: number; first_name: string; last_name?: string; username?: string; language_code?: string };

    const user: TelegramUser = {
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      username: u.username,
      languageCode: u.language_code,
    };
    
    return user;
  } catch (error) {
    console.error('Error validating initData:', error);
    return null;
  }
}

/**
 * Извлекает initData из URL
 */
export function getInitDataFromUrl(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('tgWebAppData');
}

/**
 * Проверяет, запущено ли приложение в Telegram
 */
export function isTelegramWebApp(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return 'Telegram' in window && 'WebApp' in (window as unknown as { Telegram?: { WebApp?: unknown } }).Telegram!;
}

/**
 * Получает данные пользователя из Telegram WebApp
 */
export function getTelegramUser(): TelegramUser | null {
  if (typeof window === 'undefined' || !isTelegramWebApp()) {
    return null;
  }
  
  const webApp = (window as unknown as { Telegram: { WebApp: { initDataUnsafe?: { user?: { id: number; first_name: string; last_name?: string; username?: string; language_code?: string } } } } }).Telegram.WebApp;
  
  if (!webApp.initDataUnsafe?.user) {
    return null;
  }
  
  return {
    id: webApp.initDataUnsafe.user.id,
    firstName: webApp.initDataUnsafe.user.first_name,
    lastName: webApp.initDataUnsafe.user.last_name,
    username: webApp.initDataUnsafe.user.username,
    languageCode: webApp.initDataUnsafe.user.language_code
  };
}
