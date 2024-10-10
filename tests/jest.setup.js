const { saveSchedule, getSchedule, isTimeInSchedule } = require('./schedule');

describe('Schedule functionality', () => {
  beforeEach(() => {
    // mocking chrome.storage.local
    global.chrome = {
      storage: {
        local: {
          set: jest.fn((data, callback) => callback()),
          get: jest.fn((keys, callback) => callback({})),
        },
      },
    };
  });

  test('saveSchedule saves the schedule correctly', async () => {
    const startTime = '09:00';
    const endTime = '17:00';
    const result = await saveSchedule(startTime, endTime);
    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      { startTime, endTime },
      expect.any(Function)
    );
    expect(result).toEqual({ startTime, endTime });
  });

  test('getSchedule retrieves the saved schedule', async () => {
    const startTime = '09:00';
    const endTime = '17:00';
    chrome.storage.local.get.mockImplementation((keys, callback) => 
      callback({ startTime, endTime })
    );
    const result = await getSchedule();
    expect(chrome.storage.local.get).toHaveBeenCalledWith(
      ['startTime', 'endTime'],
      expect.any(Function)
    );
    expect(result).toEqual({ startTime, endTime });
  });

  test('isTimeInSchedule returns true when time is within schedule', () => {
    const schedule = { startTime: '09:00', endTime: '17:00' };
    expect(isTimeInSchedule('12:00', schedule)).toBe(true);
    expect(isTimeInSchedule('09:00', schedule)).toBe(true);
    expect(isTimeInSchedule('17:00', schedule)).toBe(true);
  });

  test('isTimeInSchedule returns false when time is outside schedule', () => {
    const schedule = { startTime: '09:00', endTime: '17:00' };
    expect(isTimeInSchedule('08:59', schedule)).toBe(false);
    expect(isTimeInSchedule('17:01', schedule)).toBe(false);
  });

  test('isTimeInSchedule handles overnight schedules', () => {
    const schedule = { startTime: '22:00', endTime: '06:00' };
    expect(isTimeInSchedule('23:00', schedule)).toBe(true);
    expect(isTimeInSchedule('01:00', schedule)).toBe(true);
    expect(isTimeInSchedule('05:59', schedule)).toBe(true);
    expect(isTimeInSchedule('06:00', schedule)).toBe(true);
    expect(isTimeInSchedule('21:59', schedule)).toBe(false);
    expect(isTimeInSchedule('06:01', schedule)).toBe(false);
  });
});