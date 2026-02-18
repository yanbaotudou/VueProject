const PREFIX = "drink-admin";
const STORAGE_KEYS = {
  DB: `${PREFIX}:db`,
  TOKEN: `${PREFIX}:token`,
  AUTH_PROFILE: `${PREFIX}:auth-profile`
};
function getStorageItem(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Failed to parse localStorage key: ${key}`, error);
    return fallback;
  }
}
function setStorageItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function removeStorageItem(key) {
  localStorage.removeItem(key);
}
export {
  STORAGE_KEYS,
  getStorageItem,
  removeStorageItem,
  setStorageItem
};
