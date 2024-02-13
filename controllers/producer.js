const User = require("../models/Product");
const { setupRabbitMQ } = require("../lib/rabbitMq");
const { transporter } = require("../lib/nodemailer");
const exchangeName = "newsletter_exchange";

// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *

// Schedule cron job to send newsletter to subscribed users every week
const scheduleCronJobSubscribe = async () => {
  try {
    cron.schedule("0 0 * * 0", async () => {
      const users = await User.find();

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

// Schedule cron job to send emails every week to let user subscribe to newsletter
const scheduleCronJobNewsletter = async () => {
  try {
    cron.schedule("0 0 * * 0", async () => {
      const users = await User.find();

      const channel = await setupRabbitMQ(exchangeName);

      users.forEach(async (user) => {
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

const setupRabbitMQConsumer = async () => {
  
  const channel = await setupRabbitMQ(exchangeName);

  const { queue } = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(queue, exchangeName, "");

  console.log("Waiting for messages...");

  channel.consume(queue, async (msg) => {
    const userEmail = msg.content.toString();
    console.log(`Received message for ${userEmail}`);

    // Send email to user
    await sendEmail(userEmail);

    channel.ack(msg);
  });
};

module.exports = {
  scheduleCronJobNewsletter,
  scheduleCronJobSubscribe,
};
