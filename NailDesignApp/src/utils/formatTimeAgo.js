import {
  format,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";

export function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const minutes = differenceInMinutes(now, date);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

  const hours = differenceInHours(now, date);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;

  const days = differenceInDays(now, date);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  return format(date, "MMM d, yyyy");
}
