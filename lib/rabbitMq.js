// Set up RabbitMQ connection
const rabbitMQUrl = 'amqp://localhost';

async function setupRabbitMQ(exchangeName) {
    const connection = await amqp.connect(rabbitMQUrl);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'fanout', { durable: false ,autoDelete: true});

    return channel;
}

module.exports = {
    setupRabbitMQ,
}