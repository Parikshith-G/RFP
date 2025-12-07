const sequelize = require("../config/db");

const Vendor = require("./vendor");
const Rfp = require("./rfp");
const Proposal = require("./proposal");

Rfp.hasMany(Proposal, { foreignKey: "rfpId" });
Proposal.belongsTo(Rfp, { foreignKey: "rfpId" });

Vendor.hasMany(Proposal, { foreignKey: "vendorId" });
Proposal.belongsTo(Vendor, { foreignKey: "vendorId" });

module.exports = {
  sequelize,
  Vendor,
  Rfp,
  Proposal,
};
