const express = require("express");
const router = express.Router();
const rfpController = require("../controllers/rfpControllers");

router.get("/:id/proposals", rfpController.getProposalsWithScores);
router.post("/raw-text", rfpController.extractUserTextToFeedToAi);
router.get("/hello", rfpController.Hello);
module.exports = router;
