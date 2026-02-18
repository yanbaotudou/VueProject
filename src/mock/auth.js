import { readDatabase } from "./db";
import { wait } from "./common";
async function login(payload) {
  const db = readDatabase();
  const staff = db.staff.find(
    (item) => item.username === payload.username && item.password === payload.password && item.status === "enabled"
  );
  if (!staff) {
    return Promise.reject(new Error("\u8D26\u53F7\u6216\u5BC6\u7801\u9519\u8BEF\uFF0C\u6216\u8D26\u53F7\u5DF2\u88AB\u7981\u7528"));
  }
  return wait(
    {
      token: `token_${staff.id}_${Date.now()}`,
      profile: {
        id: staff.id,
        name: staff.name,
        role: staff.role,
        username: staff.username
      }
    },
    400
  );
}
export {
  login
};
