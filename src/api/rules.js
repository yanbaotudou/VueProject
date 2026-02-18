import * as ruleMock from "@/mock/rules";
const rulesApi = {
  getRules: ruleMock.getRules,
  updateNextDayRule: ruleMock.updateNextDayRule,
  updateCouponRule: ruleMock.updateCouponRule,
  previewNextDayStock: ruleMock.previewNextDayStock,
  previewCouponRule: ruleMock.previewCouponRule
};
export {
  rulesApi
};
