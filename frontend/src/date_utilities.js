function formatDate(arg) {
  const dateObj = new Date(arg);
  const format = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [
    { value: month },
    ,
    { value: day },
    ,
    { value: year },
  ] = format.formatToParts(dateObj);
  return `${month}/${day}/${year}`;
}

function today() {
  const format = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [
    { value: month },
    ,
    { value: day },
    ,
    { value: year },
  ] = format.formatToParts(new Date());
  return `${year}-${month}-${day}`;
}

const upcomingFilter = function (item) {
  const today = new Date();
  const within_week = new Date().setDate(today.getDate() + 7);
  const overdue = new Date().setDate(today.getDate() - 1);
  const itemTime = new Date(item.due).getTime()
  return itemTime <= within_week && itemTime >= overdue;
}

const overdueFilter = function (item) {
  const today = new Date();
  const overdue = new Date().setDate(today.getDate() - 1);
  const itemTime = new Date(item.due).getTime()
  return itemTime <= overdue;
}

const isOverdue = function (due_date) {
  const today = new Date();
  const overdue = new Date().setDate(today.getDate() - 1);
  const itemTime = new Date(due_date).getTime()
  return itemTime <= overdue;
}

export { formatDate, today, overdueFilter, upcomingFilter, isOverdue }