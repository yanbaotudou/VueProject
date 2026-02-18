import { generateId, paginate, wait, formatDate } from "./common";
import { readDatabase, updateDatabase } from "./db";
async function getDrinkCategories() {
  const db = readDatabase();
  return wait(db.drinkCategories);
}
async function listDrinks(query) {
  const db = readDatabase();
  let filtered = [...db.drinks];
  if (query.keyword) {
    filtered = filtered.filter((item) => item.name.includes(query.keyword ?? ""));
  }
  if (query.categoryId) {
    filtered = filtered.filter((item) => item.categoryId === query.categoryId);
  }
  if (query.status) {
    filtered = filtered.filter((item) => item.status === query.status);
  }
  filtered.sort((a, b) => a.updatedAt > b.updatedAt ? -1 : 1);
  return wait(paginate(filtered, query));
}
async function createDrink(payload) {
  const now = formatDate(/* @__PURE__ */ new Date());
  const db = updateDatabase((draft) => {
    draft.drinks.unshift({
      id: generateId("drink"),
      ...payload,
      createdAt: now,
      updatedAt: now
    });
  });
  return wait(db.drinks[0]);
}
async function updateDrink(id, payload) {
  const now = formatDate(/* @__PURE__ */ new Date());
  const db = updateDatabase((draft) => {
    const index = draft.drinks.findIndex((item) => item.id === id);
    if (index !== -1) {
      draft.drinks[index] = {
        ...draft.drinks[index],
        ...payload,
        updatedAt: now
      };
    }
  });
  const target = db.drinks.find((item) => item.id === id);
  if (!target) {
    return Promise.reject(new Error("\u996E\u54C1\u4E0D\u5B58\u5728"));
  }
  return wait(target);
}
async function deleteDrink(id) {
  updateDatabase((draft) => {
    draft.drinks = draft.drinks.filter((item) => item.id !== id);
  });
  return wait(void 0);
}
async function toggleDrinkStatus(id) {
  const now = formatDate(/* @__PURE__ */ new Date());
  const db = updateDatabase((draft) => {
    const target2 = draft.drinks.find((item) => item.id === id);
    if (target2) {
      target2.status = target2.status === "on" ? "off" : "on";
      target2.updatedAt = now;
    }
  });
  const target = db.drinks.find((item) => item.id === id);
  if (!target) {
    return Promise.reject(new Error("\u996E\u54C1\u4E0D\u5B58\u5728"));
  }
  return wait(target);
}
export {
  createDrink,
  deleteDrink,
  getDrinkCategories,
  listDrinks,
  toggleDrinkStatus,
  updateDrink
};
