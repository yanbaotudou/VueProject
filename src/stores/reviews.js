import { defineStore } from "pinia";
import { reviewsApi } from "@/api/reviews";
const useReviewsStore = defineStore("reviews", {
  state: () => ({
    list: [],
    total: 0,
    loading: false,
    query: {
      page: 1,
      pageSize: 10,
      status: void 0,
      keyword: ""
    }
  }),
  actions: {
    async fetchList(partial) {
      this.loading = true;
      try {
        this.query = {
          ...this.query,
          ...partial
        };
        const result = await reviewsApi.listReviews(this.query);
        this.list = result.list;
        this.total = result.total;
      } finally {
        this.loading = false;
      }
    },
    async reply(id, content, staffName) {
      await reviewsApi.replyReview(id, content, staffName);
      await this.fetchList();
    }
  }
});
export {
  useReviewsStore
};
