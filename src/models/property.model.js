const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Property = db.define("Property", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM("numero", "fecha", "check"), allowNull: false },
});

module.exports = Property;
