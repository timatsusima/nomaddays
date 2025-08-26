// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock dayjs timezone plugins
jest.mock('dayjs/plugin/timezone', () => ({
  default: jest.fn()
}));
jest.mock('dayjs/plugin/utc', () => ({
  default: jest.fn()
}));

// Mock Telegram WebApp
global.Telegram = {
  WebApp: {
    initData: 'test',
    initDataUnsafe: {
      user: {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser'
      }
    }
  }
};
