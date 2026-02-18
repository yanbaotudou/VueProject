import { wait } from "./common";
import { readDatabase, updateDatabase } from "./db";
async function getSettings() {
  const db = readDatabase();
  return wait(db.settings);
}
async function updateSettings(payload) {
  const db = updateDatabase((draft) => {
    draft.settings = {
      ...payload
    };
  });
  return wait(db.settings);
}
export {
  getSettings,
  updateSettings
};
