const express = require("express");

const router = express.Router();

const { scheduleCronJobSubscribe, scheduleCronJobNewsletter } = require("../controllers/producer");

router.route("/").get(scheduleCronJob);
module.exports = router;
