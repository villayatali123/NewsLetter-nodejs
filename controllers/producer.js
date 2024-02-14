const User = require("../models/User");
const { setupRabbitMQ } = require("../lib/rabbitMq");
const { sendSubscribeEmail } = require("../lib/nodemailer");
const exchangeName = "newsletter_exchange";
const cron = require("node-cron");

// Schedule cron job to send emails every week to let user subscribe to newsletter

const scheduleCronJobSubscribe = async () => {
  try {
    cron.schedule("*/1 * * * *", async () => {
      const users = await User.find();
      
    //   console.log("user info from subscribe fn ===>", users);

      users.forEach(async (user) => {
        if (!user.isSubscribed) await sendSubscribeEmail(user.email);
      });
    });
  } catch (error) {
    console.log("Error ===> ", error);
  }
};

// Schedule cron job to send newsletter to subscribed users every week
const scheduleCronJobNewsletter = async () => {
  try {
    cron.schedule("*/2 * * * *", async () => {
      const users = await User.find();

      const channel = await setupRabbitMQ(exchangeName);

      users.forEach(async (user) => {
        console.log("user in newsletter ", user);
        // Publish email to RabbitMQ
        if (user.isSubscribed) {
          channel.publish(
            exchangeName,
            "",
            Buffer.from(JSON.stringify({ email: user.email }))
          );
        }
      });
      console.log("Message published: to queue", exchangeName);
    });
  } catch (error) {
    console.log("error ===> ", error);
  }
};

module.exports = {
  scheduleCronJobNewsletter,
  scheduleCronJobSubscribe,
};
