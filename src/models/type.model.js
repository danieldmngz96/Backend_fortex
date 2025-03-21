const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Type = db.define("Type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
});

module.exports = Type; 