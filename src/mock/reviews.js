import { formatDate, paginate, wait } from "./common";
import { readDatabase, updateDatabase } from "./db";
async function listReviews(query) {
  const db = readDatabase();
  let filtered = [...db.reviews];
  if (query.status) {
    filtered = filtered.filter((item) => item.status === query.status);
  }
  if (query.keyword) {
    filtered = filtered.filter(
      (item) => item.userName.includes(query.keyword ?? "") || item.drinkName.includes(query.keyword ?? "") || item.content.includes(query.keyword ?? "")
    );
  }
  filtered.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1);
  return wait(paginate(filtered, query));
}
async function replyReview(id, content, staffName) {
  const db = updateDatabase((draft) => {
    const review = draft.reviews.find((item) => item.id === id);
    if (!review) return;
    review.status = "replied";
    review.reply = {
      content,
      staffName,
      replyAt: formatDate(/* @__PURE__ */ new Date())
    };
  });
  const target = db.reviews.find((item) => item.id === id);
  if (!target) {
    return Promise.reject(new Error("\u8BC4\u8BBA\u4E0D\u5B58\u5728"));
  }
  return wait(target);
}
export {
  listReviews,
  replyReview
};
