const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Rfp = sequelize.define(
  "Rfp",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    budget: {
      type: DataTypes.DECIMAL(12, 2),
    },
    deliveryDays: {
      type: DataTypes.INTEGER,
      field: "delivery_days",
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    structuredRfp: {
      type: DataTypes.JSON,
      field: "structured_rfp",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    tableName: "rfps",
    timestamps: false,
  }
);

module.exports = Rfp;
