const { DataTypes } = require("sequelize");
const db = require("../config/database");
const Type = require("./type.model");
const Property = require("./property.model");

const TypeProperty = db.define("TypeProperty", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

Type.belongsToMany(Property, { through: TypeProperty });
Property.belongsToMany(Type, { through: TypeProperty });

module.exports = TypeProperty;
