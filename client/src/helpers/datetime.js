const getUTCDate = (dateString = Date.now()) => {
  const date = new Date(dateString);

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
};

const getWeekIndex = day => {
  let count = null;
  if (day <= 7) {
    count = 1;
  } else if (day > 7 && day <= 14) {
    count = 2;
  } else if (day > 14 && day <= 21) {
    count = 3;
  } else if (day > 21 && day <= 28) {
    count = 4;
  } else if (day > 28) {
    count = 5;
  }
  return count;
};
export { getUTCDate, getWeekIndex };
