const User = require("../models/User");
const { setupRabbitMQ } = require("../lib/rabbitMq");
const { transporter } = require("../lib/nodemailer");
const exchangeName = "newsletter_exchange";
const cron = require('node-cron');

console.log('this is trasnporter ===>',transporter);
// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *

// Schedule cron job to send emails every week to let user subscribe to newsletter

const scheduleCronJobSubscribe = async () => {
  try {
    cron.schedule("*/1 * * * *", async () => {
      // const users = await User.find();
      const users = [{email:'villizain6@gmail.com'} , {email:'villayatali.18je0925@am.iitism.ac.in'}]
      console.log("user info from subscribe fn ===>" , users);
      users.forEach(async (user) => {
        const mailOptions = {
          from: "villayat56@gmail.com",
          to: user.email,
          subject: "Weekly Newsletter Subscription",
          html:
            '<p>Subscribe to our newsletter: <a href="http://localhost:3020/subscribe?email=' +
            user.email +
            '">Subscribe</a></p>',
        };
        if (!user.isSubscribed) await transporter.sendMail(mailOptions);
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
      // const users = await User.find();
      const users = [{email:'villizain6@gmail.com'} , {email:'villayatali.18je0925@am.iitism.ac.in'}]
      // console.log("user info ==>", users);
      const channel = await setupRabbitMQ(exchangeName);

      users.forEach(async (user) => {
        console.log("user in newsletter ", user);
        // Publish email to RabbitMQ
        channel.publish(
          exchangeName,
          "",
          Buffer.from(JSON.stringify({ email: user.email }))
        );
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
