const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Proposal = sequelize.define(
  "Proposal",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rfpId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "rfp_id",
    },
    vendorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "vendor_id",
    },
    totalPrice: {
      type: DataTypes.DECIMAL(12, 2),
      field: "total_price",
    },
    deliveryDays: {
      type: DataTypes.INTEGER,
      field: "delivery_days",
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    parsed: {
      type: DataTypes.JSON,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    tableName: "proposals",
    timestamps: false,
  }
);

module.exports = Proposal;
