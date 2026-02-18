import { updateDatabase, readDatabase } from "./db";
import { wait } from "./common";
async function getStoreInfo() {
  const db = readDatabase();
  return wait(db.storeInfo);
}
async function updateStoreInfo(payload) {
  const db = updateDatabase((draft) => {
    draft.storeInfo = {
      ...payload
    };
  });
  return wait(db.storeInfo);
}
export {
  getStoreInfo,
  updateStoreInfo
};
