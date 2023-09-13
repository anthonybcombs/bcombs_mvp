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


export function militaryToRegularTime(militaryTime) {
  // Split the military time into hours and minutes
  const [hours, minutes] = militaryTime.split(':').map(Number);

  // Determine AM or PM
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  const regularHours = hours % 12 || 12; // Handle 0 as 12 for 12 AM and 12 PM

  // Format the result
  const regularTime = `${regularHours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;

  return regularTime;
}
