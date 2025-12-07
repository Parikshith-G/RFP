const express = require("express");
const router = express.Router();
const proposalController = require("../controllers/proposalControllers");

router.post("/inbound", proposalController.handleInboundProposal);
router.get("/hello", proposalController.Hello);
module.exports = router;
