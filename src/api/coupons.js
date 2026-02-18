import * as couponsMock from "@/mock/coupons";
const couponsApi = {
  listCouponTemplates: couponsMock.listCouponTemplates,
  createCouponTemplate: couponsMock.createCouponTemplate,
  updateCouponTemplate: couponsMock.updateCouponTemplate,
  deleteCouponTemplate: couponsMock.deleteCouponTemplate,
  listCouponRecords: couponsMock.listCouponRecords,
  sendCoupon: couponsMock.sendCoupon,
  sendCouponsByRule: couponsMock.sendCouponsByRule
};
export {
  couponsApi
};
