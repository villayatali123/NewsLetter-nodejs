require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

//connect DB
const connectDB = require("./db/connect");

//router
const subscribeRoute = require("./routes/subscribeRoute");

app.use("/api/v1", subscribeRoute);

const port = process.env.PORT || 3000;

// // const User = require("./models/User");
// //post a user to DB
// app.post("/api/user", async (req, res) => {
//   const { email } = req.body;
//   //check valid email & password
//   if (!email) {
//     throw new Error("Plese Provide Email & Password");
//   }
//   const userPresent = await User.findOne({ email });
//   //verify user
//   if (userPresent) {
//     throw new Error("User Already Exist!");
//   }
//   const user = await User.create({ ...req.body });
//   res.send("succesfull")
// });
// //Get all user
// app.get("/api/user", async (req, res) => {
//   const users = await User.find({});

//   res.status(200).json({users})
// });

//Schedule cron jobs
require("./controllers/producer").scheduleCronJobSubscribe();
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
