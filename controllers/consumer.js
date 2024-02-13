const { setupRabbitMQ } = require("../lib/rabbitMq");
const exchangeName = "newsletter_exchange";
const { sendEmail } = require("../lib/nodemailer");

const consumeMessage = async () => {
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
  consumeMessage,
};
