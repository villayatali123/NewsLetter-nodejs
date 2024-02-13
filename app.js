require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

//connect DB
const connectDB = require("./db/connect");

//router
const subscribeRoute = require("./routes/subscribeRoute");

app.use("/api/v1", subscribeRoute);

const port = process.env.PORT || 3000;

//Schedule cron jobs
require("./controllers/producer").scheduleCronJobNewsletter();
require("./controllers/producer").scheduleCronJobNewsletter();
require("./controllers/consumer").consumeMessage();

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("DB connected");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
