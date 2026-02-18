import * as staffMock from "@/mock/staff";
const staffApi = {
  listStaff: staffMock.listStaff,
  createStaff: staffMock.createStaff,
  updateStaff: staffMock.updateStaff,
  deleteStaff: staffMock.deleteStaff,
  toggleStaffStatus: staffMock.toggleStaffStatus
};
export {
  staffApi
};
