export function yearList(endYear) {
  const years = [];
  let startYear = 1980;
  while (startYear <= endYear) {
    years.push(startYear++);
  }
  return years.sort((a, b) => b - a);
}

export function isValidDate(date) {
  return isNaN(date) && !isNaN(Date.parse(date));
}
