const express = require("express");

const router = express.Router();

const {
    verifySubscriptionMail,
} = require("../controllers/subscribe");

router.route("/").post(verifySubscriptionMail);

module.exports = router;
