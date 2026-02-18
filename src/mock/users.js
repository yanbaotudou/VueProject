import { paginate, wait } from "./common";
import { readDatabase } from "./db";
async function listUsers(query) {
  const db = readDatabase();
  let filtered = [...db.users];
  if (query.keyword) {
    filtered = filtered.filter(
      (item) => item.name.includes(query.keyword ?? "") || item.phone.includes(query.keyword ?? "")
    );
  }
  if (query.tier) {
    filtered = filtered.filter((item) => item.tier === query.tier);
  }
  filtered.sort((a, b) => b.orderCount - a.orderCount);
  return wait(paginate(filtered, query));
}
async function getUserDetail(id) {
  const db = readDatabase();
  const target = db.users.find((item) => item.id === id);
  if (!target) {
    return Promise.reject(new Error("\u7528\u6237\u4E0D\u5B58\u5728"));
  }
  return wait(target);
}
export {
  getUserDetail,
  listUsers
};
