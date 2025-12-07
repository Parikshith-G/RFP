const Proposal = require("../models/proposal");
const { processProposalText } = require("../utils/ai");

exports.Hello = async (req, res) => {
  res.send("Hello from Proposal Controller!");
};

exports.handleInboundProposal = async (req, res) => {
  try {
    const { rfpId, vendorId, rawProposalText } = req.body;

    if (!rfpId || !vendorId || !rawProposalText) {
      return res
        .status(400)
        .json({ message: "Missing required IDs or proposal text." });
    }

    const extractedData = await processProposalText(rawProposalText, rfpId);

    if (
      !extractedData ||
      !extractedData.total_price ||
      !extractedData.delivery_days
    ) {
      return res.status(422).json({
        message:
          "AI failed to extract core commercial details (price/delivery).",
        details: extractedData,
      });
    }

    const newProposal = await Proposal.create({
      rfpId: rfpId,
      vendorId: vendorId,

      totalPrice: extractedData.total_price,
      deliveryDays: extractedData.delivery_days,
      quantity: extractedData.quantity,

      parsed: extractedData,
    });

    res.status(201).json({
      message: "Proposal successfully parsed and stored.",
      proposal: newProposal,
    });
  } catch (error) {
    console.error("Error processing inbound proposal:", error);
    res.status(500).json({
      message: "Failed to parse and store proposal.",
      error: error.message,
    });
  }
};
