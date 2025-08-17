import amqp from 'amqplib';

let channel = null;

/**
 * Connects to the RabbitMQ server and creates a channel.
 * This should be called once when the application starts.
 */
const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();
        console.log('RabbitMQ connected successfully.');

        // Asserting a queue makes sure it exists. If it doesn't, it will be created.
        // `durable: true` ensures the queue survives a RabbitMQ server restart.
        await channel.assertQueue('email_notifications', { durable: true });
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        // In a real-world scenario, you might want to implement a retry mechanism.
    }
};

/**
 * Publishes a message to a specified RabbitMQ queue.
 * @param {string} queue - The name of the queue.
 * @param {object} message - The message object to be sent. Must be serializable to JSON.
 */
const publishMessage = (queue, message) => {
    if (!channel) {
        console.error("RabbitMQ channel is not available. Cannot publish message.");
        // You could add logic here to buffer messages and send them once the connection is re-established.
        return;
    }
    try {
        // We convert the message object to a JSON string and then to a Buffer,
        // which is the format RabbitMQ expects.
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
            persistent: true // This makes the message durable, so it's not lost if RabbitMQ restarts.
        });
        console.log(`[x] Sent message to queue '${queue}':`, message);
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
    }
};

export { connectRabbitMQ, publishMessage };
