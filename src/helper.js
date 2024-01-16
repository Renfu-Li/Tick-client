export const getTimerStr = (time) => {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);

  const padTime = (timeData) => {
    return timeData.toString().padStart(2, "0");
  };

  const minutesAndSeconds = `${padTime(minutes)}:${padTime(seconds)}`;

  const timerStr =
    hours === 0 ? minutesAndSeconds : `${padTime(hours)}:${minutesAndSeconds}`;

  return timerStr;
};

export const getShortDateStr = (date = new Date()) => {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

export const getLongDateStr = (date = new Date()) => {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getNumericDateStr = (date = new Date()) => {
  return new Date(date).toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
};

export const getTimeStr = (time) => {
  return new Date(time).toLocaleTimeString(undefined, {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
  });
};

export const getDurationStr = (minutes) => {
  const hour = Math.floor(minutes / 60);
  const roundedHour = Number((minutes / 60).toFixed(1));
  const minute = minutes - hour * 60;
  const durationStr = hour > 0 ? `${hour}h${minute}m` : `${minute}m`;

  return { hour, minute, durationStr, roundedHour };
};

export const calcuDuration = (start, end) => {
  const diffInMs = new Date(end) - new Date(start);
  const minuteInMs = 60 * 1000;
  const durationInMinutes = Math.round(diffInMs / minuteInMs);
  const { durationStr, hour, minute } = getDurationStr(durationInMinutes);

  return { durationStr, hour, minute, durationInMinutes };
};

export const calcuDateDiff = (before, after) => {
  const dayInMs = 24 * 60 * 60 * 1000;
  const diffInMs = Math.round(
    new Date(after).getTime() - new Date(before).getTime()
  );
  return diffInMs / dayInMs;
};

export const getMonday = (date = new Date()) => {
  const monday = new Date(date);
  const dayOfWeek = monday.getDay();
  const diff = dayOfWeek - (dayOfWeek === 0 ? -6 : 1);
  monday.setDate(monday.getDate() - diff);
  monday.getHours(0, 0, 0, 0);

  return monday;
};

export const getAllMondays = (firstMonday, numOfWeeks) => {
  let allMondays = [firstMonday];
  for (let i = 0; i < numOfWeeks - 1; i++) {
    const nextMonday = new Date(allMondays[allMondays.length - 1]);
    nextMonday.setDate(nextMonday.getDate() + 7);
    allMondays.push(nextMonday);
  }

  return allMondays;
};

export const getDateStrsInAWeek = (monday) => {
  let dateStrArr = [];
  const nextMonday = addDays(7, monday);

  for (let date = monday; date < nextMonday; date = addDays(1, date)) {
    const numericStr = getNumericDateStr(date);
    const longStr = getLongDateStr(date);

    dateStrArr.push({
      numericStr,
      longStr,
    });
  }

  return dateStrArr;
};

export const addDays = (dateDiff, date = new Date()) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + dateDiff);
  newDate.setHours(0, 0, 0, 0);

  return newDate;
};

export const getFirstDayOfMonth = (date = new Date()) => {
  const newDate = new Date(date);
  newDate.setDate(1);
  newDate.setHours(0, 0, 0, 0);

  return newDate;
};

export const getFirstDayOfNextMonth = (date = new Date()) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1, 1);
  newDate.setHours(0, 0, 0, 0);

  return newDate;
};
