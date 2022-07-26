export const localCurrentDateTimeString = (timezone) => {
  const date = new Date();
  const dateString = date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone,
  });
  const timeString = date.toLocaleTimeString('en-CA', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timezone,
  });
  return `${dateString} ${timeString}`;
};
