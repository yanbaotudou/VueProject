function wait(data, ms = 350) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(structuredCloneSafe(data));
    }, ms);
  });
}
function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}
function paginate(source, query) {
  const start = (query.page - 1) * query.pageSize;
  const end = start + query.pageSize;
  return {
    list: source.slice(start, end),
    total: source.length
  };
}
function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
function dayOffset(days) {
  const now = /* @__PURE__ */ new Date();
  now.setDate(now.getDate() - days);
  return formatDate(now);
}
export {
  dayOffset,
  formatDate,
  generateId,
  paginate,
  structuredCloneSafe,
  wait
};
