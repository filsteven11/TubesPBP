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
  },
  
  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", { email: "admin@gmail.com" });
  }
};