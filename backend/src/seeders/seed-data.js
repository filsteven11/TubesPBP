const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {

    const hash = await bcrypt.hash("admin123", 10);
    await queryInterface.bulkInsert("Users", [{
      email: "admin@mail.com",
      password: hash,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);

 
    await queryInterface.bulkInsert("Categories", [
      { name: "Burger", createdAt: new Date(), updatedAt: new Date() },
      { name: "Drink", createdAt: new Date(), updatedAt: new Date() },
      { name: "Dessert", createdAt: new Date(), updatedAt: new Date() },
    ]);

    
    await queryInterface.bulkInsert("Products", [
      { name: "Big Mac", price: 45000, categoryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: "McChicken", price: 35000, categoryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: "French Fries", price: 15000, categoryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: "Coca Cola", price: 12000, categoryId: 2, createdAt: new Date(), updatedAt: new Date() },
      { name: "Sprite", price: 12000, categoryId: 2, createdAt: new Date(), updatedAt: new Date() },
      { name: "McFlurry", price: 18000, categoryId: 3, createdAt: new Date(), updatedAt: new Date() },
      { name: "Apple Pie", price: 10000, categoryId: 3, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Products", null, {});
    await queryInterface.bulkDelete("Categories", null, {});
  }
};