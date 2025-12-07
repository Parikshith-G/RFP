const Rfp = require("../models/rfp");
const Proposal = require("../models/proposal");
const Vendor = require("../models/vendor");
const sequelize = require("../config/db");
const { scoreProposal } = require("../utils/score");
const { processRfpText, generateRecommendation } = require("../utils/ai");
const { sendRfpEmail } = require("../utils/emailer");
exports.extractUserTextToFeedToAi = async (req, res) => {
  const { userText } = req.body;
  const responseFromAi = await processRfpText(userText);
  if (!responseFromAi || !responseFromAi.category || !responseFromAi.title) {
    return res.status(422).json({
      message:
        "AI failed to extract required fields (title, category) for RFP.",
      details: responseFromAi,
    });
  }

  const newRfp = await Rfp.create({
    title: responseFromAi.title,
    category: responseFromAi.category,
    budget: responseFromAi.budget,
    deliveryDays: responseFromAi.delivery_days,
    quantity: responseFromAi.quantity,
    structuredRfp: responseFromAi,
    message: responseFromAi.mailMessage,
  });

  const lowerCaseCategory = newRfp.category.toLowerCase();

  const vendors = await Vendor.findAll({
    where: sequelize.where(
      sequelize.fn("LOWER", sequelize.col("category")),
      "=",
      lowerCaseCategory
    ),
  });
  if (vendors.length === 0) {
    console.log(`No vendors found for category: ${newRfp.category}`);
    return res.status(201).json({
      message: "RFP created, but no matching vendors were found to send to.",
      rfp: newRfp,
    });
  }

  const sendPromises = vendors.map((vendor) => {
    console.log(`Sending RFP to vendor: ${vendor.name} at ${vendor.email}`);
    sendRfpEmail(vendor.email, newRfp);
  });

  await Promise.all(sendPromises);

  res.status(201).json({
    message: `RFP created and sent to ${vendors.length} matching vendors!`,
    rfp: newRfp,
    vendorsSentTo: vendors.map((v) => v.name),
  });
};
exports.Hello = async (req, res) => {
  res.send("Hello from RFP Controller!");
};

exports.getProposalsWithScores = async (req, res) => {
  try {
    const rfp = await Rfp.findByPk(req.params.id);
    if (!rfp) return res.status(404).json({ message: "RFP not found" });

    const constraints = rfp.structuredRfp;
    const proposals = await Proposal.findAll({
      where: { rfpId: req.params.id },
      include: [Vendor],
    });

    const scoredProposals = proposals.map((p) => {
      const score = scoreProposal(p, constraints);
      return {
        ...p.toJSON(),
        score: Number(score.toFixed(2)),
      };
    });
    scoredProposals.sort((a, b) => b.score - a.score);

    const topProposals = scoredProposals.slice(0, 3);

    let aiRecommendation = "System recommendation processing is active.";

    if (topProposals.length >= 2) {
      aiRecommendation = await generateRecommendation(
        constraints,
        topProposals
      );
    } else if (topProposals.length === 1) {
      aiRecommendation = `Only one proposal received from ${topProposals[0].Vendor.name}. Score: ${topProposals[0].score}. Cannot compare.`;
    } else {
      aiRecommendation = "No proposals have been submitted for this RFP yet.";
    }
    res.json({
      rfp,
      proposals: scoredProposals,
      aiRecommendation: aiRecommendation,
    });
  } catch (err) {
    console.error("Error in getProposalsWithScores:", err);
    res.status(500).json({ message: "Server error", detail: err.message });
  }
};
