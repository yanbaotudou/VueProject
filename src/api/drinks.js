import * as drinkMock from "@/mock/drinks";
const drinksApi = {
  getDrinkCategories: drinkMock.getDrinkCategories,
  listDrinks: drinkMock.listDrinks,
  createDrink: drinkMock.createDrink,
  updateDrink: drinkMock.updateDrink,
  deleteDrink: drinkMock.deleteDrink,
  toggleDrinkStatus: drinkMock.toggleDrinkStatus
};
export {
  drinksApi
};
