export function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `Today at ${formatTime(date)}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${formatTime(date)}`;
  } else {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} at ${formatTime(date)}`;
  }
}

function formatTime(date: Date) {
  let hours: string | number = date.getHours();
  let minutes: string | number = date.getMinutes();

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return `${hours}:${minutes}`;
}
