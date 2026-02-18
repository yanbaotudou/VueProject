import { formatDate, generateId, paginate, wait } from "./common";
import { readDatabase, updateDatabase } from "./db";
async function listStaff(query) {
  const db = readDatabase();
  let filtered = [...db.staff];
  if (query.keyword) {
    filtered = filtered.filter(
      (item) => item.name.includes(query.keyword ?? "") || item.phone.includes(query.keyword ?? "") || item.username.includes(query.keyword ?? "")
    );
  }
  if (query.role) {
    filtered = filtered.filter((item) => item.role === query.role);
  }
  if (query.status) {
    filtered = filtered.filter((item) => item.status === query.status);
  }
  filtered.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1);
  return wait(paginate(filtered, query));
}
async function createStaff(payload) {
  const exists = readDatabase().staff.some((item) => item.username === payload.username);
  if (exists) {
    return Promise.reject(new Error("\u7528\u6237\u540D\u5DF2\u5B58\u5728"));
  }
  const db = updateDatabase((draft) => {
    draft.staff.unshift({
      id: generateId("staff"),
      createdAt: formatDate(/* @__PURE__ */ new Date()),
      ...payload
    });
  });
  return wait(db.staff[0]);
}
async function updateStaff(id, payload) {
  const duplicate = readDatabase().staff.some((item) => item.id !== id && item.username === payload.username);
  if (duplicate) {
    return Promise.reject(new Error("\u7528\u6237\u540D\u5DF2\u5B58\u5728"));
  }
  const db = updateDatabase((draft) => {
    const index = draft.staff.findIndex((item) => item.id === id);
    if (index !== -1) {
      draft.staff[index] = {
        ...draft.staff[index],
        ...payload
      };
    }
  });
  const target = db.staff.find((item) => item.id === id);
  if (!target) {
    return Promise.reject(new Error("\u5458\u5DE5\u4E0D\u5B58\u5728"));
  }
  return wait(target);
}
async function deleteStaff(id) {
  updateDatabase((draft) => {
    draft.staff = draft.staff.filter((item) => item.id !== id);
  });
  return wait(void 0);
}
async function toggleStaffStatus(id) {
  const db = updateDatabase((draft) => {
    const target2 = draft.staff.find((item) => item.id === id);
    if (target2) {
      target2.status = target2.status === "enabled" ? "disabled" : "enabled";
    }
  });
  const target = db.staff.find((item) => item.id === id);
  if (!target) {
    return Promise.reject(new Error("\u5458\u5DE5\u4E0D\u5B58\u5728"));
  }
  return wait(target);
}
export {
  createStaff,
  deleteStaff,
  listStaff,
  toggleStaffStatus,
  updateStaff
};
