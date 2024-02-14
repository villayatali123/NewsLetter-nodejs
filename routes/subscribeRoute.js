const express = require("express");

const router = express.Router();

const {
    verifySubscriptionMail,
} = require("../controllers/subscribe");

router.route("/subscribe").get(verifySubscriptionMail);

module.exports = router;
