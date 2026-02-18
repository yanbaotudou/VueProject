import { getStorageItem, setStorageItem, STORAGE_KEYS } from "@/utils/storage";
import { structuredCloneSafe } from "./common";
import { createSeedDatabase } from "./seed";
function persistDatabase(db) {
  setStorageItem(STORAGE_KEYS.DB, db);
}
function ensureDatabase() {
  const existing = getStorageItem(STORAGE_KEYS.DB, null);
  if (existing) {
    return existing;
  }
  const seeded = createSeedDatabase();
  persistDatabase(seeded);
  return seeded;
}
function readDatabase() {
  const db = ensureDatabase();
  return structuredCloneSafe(db);
}
function writeDatabase(db) {
  persistDatabase(structuredCloneSafe(db));
}
function updateDatabase(updater) {
  const db = ensureDatabase();
  updater(db);
  persistDatabase(db);
  return structuredCloneSafe(db);
}
export {
  ensureDatabase,
  readDatabase,
  updateDatabase,
  writeDatabase
};
