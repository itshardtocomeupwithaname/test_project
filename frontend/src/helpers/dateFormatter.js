export default function dateFormatter(date) {
  return new Date(date).toLocaleDateString("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function lastEditedFormatter(date, now = new Date()) {
  const diffInMilliseconds = now.getTime() - new Date(date).getTime();
  const diffInHours = Math.max(
    0,
    Math.floor(diffInMilliseconds / (1000 * 60 * 60)),
  );

  return `最后编辑于 ${diffInHours} 小时前`;
}
