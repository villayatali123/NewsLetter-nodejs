const User = require("../models/Product");

const verifySubscriptionMail = async (req, res) => {
  const email = req.query.email;

  // Check if the email is already subscribed
  const existingUser = await User.findOne({ email });
    // Create a new user and save to the database
  if(!existingUser)
      await new User({ email }).save();

  if (existingUser?.isSubscribed) {
    return res.send("You are already subscribed!");
  }
  else {
    const filter = { _id: existingUser._id };
    const update = { $set: { isSubscribed: true } };
    const result = await User.updateOne(filter, update);
  }

  // Log the email
  await new EmailLog({ email }).save();

  res.send(
    "Thank you, you have successfully subscribed to our weekly newsletter"
  );
};

module.exports = {
  verifySubscriptionMail,
};
