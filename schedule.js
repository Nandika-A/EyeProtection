// function to save the schedule
function saveSchedule(startTime, endTime) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ startTime, endTime }, () => {
        resolve({ startTime, endTime });
      });
    });
  }
  
  // function to get the schedule
  function getSchedule() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['startTime', 'endTime'], (result) => {
        resolve(result);
      });
    });
  }
  
  // function to check if the current time is within the schedule
  function isTimeInSchedule(currentTime, schedule) {
    const { startTime, endTime } = schedule;
    if (!startTime || !endTime) return false;
  
    const current = new Date(`2000-01-01T${currentTime}`);
    const start = new Date(`2000-01-01T${startTime}`);
    let end = new Date(`2000-01-01T${endTime}`);
  
    // handle case where end time is on the next day
    if (end < start) {
      end = new Date(`2000-01-02T${endTime}`);
      if (current < start) current.setDate(current.getDate() + 1);
    }
  
    return current >= start && current <= end;
  }
  
  module.exports = {
    saveSchedule,
    getSchedule,
    isTimeInSchedule,
  };