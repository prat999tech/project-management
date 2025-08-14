import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// --- 1. Nodemailer Setup ---
// Create a transporter object using SMTP transport.
// You need to provide your email service credentials in the .env file.
// For testing, services like Mailtrap are excellent.
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10),
    secure: process.env.MAIL_SECURE === 'true', // Use 'true' for port 465, false for others
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// --- 2. RabbitMQ Consumer Logic ---
const consumeEmailQueue = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        const channel = await connection.createChannel();
        
        const queue = 'email_notifications';
        await channel.assertQueue(queue, { durable: true });
        
        console.log(`[*] Email worker is waiting for messages in queue: ${queue}.`);

        // This function is called for each message received from the queue.
        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                console.log("[x] Received message:", data);
                
                try {
                    // --- 3. Email Sending Logic ---
                    let mailOptions;

                    if (data.type === 'WELCOME_EMAIL') {
                        mailOptions = {
                            from: `"Project Management App" <no-reply@projectapp.com>`,
                            to: data.email,
                            subject: 'Welcome to Your Project Management App!',
                            text: `Hi ${data.username},\n\nWelcome to our platform! We are excited to have you on board.\n\nBest Regards,\nThe Team`,
                        };
                    } else if (data.type === 'DETAILS_UPDATED') {
                         mailOptions = {
                            from: `"Project Management App" <no-reply@projectapp.com>`,
                            to: data.email,
                            subject: 'Your Profile Details Have Been Updated',
                            text: `Hi ${data.username},\n\nThis is a confirmation that your profile details have been successfully updated.\n\nBest Regards,\nThe Team`,
                        };
                    } else if (data.type === 'PASSWORD_CHANGED') {
                        mailOptions = {
                            from: `"Project Management App" <no-reply@projectapp.com>`,
                            to: data.email,
                            subject: 'Your Password Has Been Changed',
                            text: `Hi ${data.username},\n\nThis email confirms that your password has been successfully changed. If you did not make this change, please contact support immediately.\n\nBest Regards,\nThe Team`,
                        };
                    }

                    if (mailOptions) {
                        await transporter.sendMail(mailOptions);
                        console.log(`Email sent successfully to ${data.email} for type: ${data.type}`);
                    }
                    
                    // --- 4. Acknowledge the message ---
                    // This tells RabbitMQ that the message has been successfully processed
                    // and can be safely removed from the queue.
                    channel.ack(msg);

                } catch (emailError) {
                    console.error("Failed to send email or process message:", emailError);
                    // In a real production app, you might want to 'nack' (not acknowledge) the message
                    // to requeue it for another try, possibly with a dead-letter queue strategy.
                    // For now, we will just log the error.
                    channel.ack(msg); // Acknowledge even on failure to prevent infinite loops for now
                }
            }
        }, {
            noAck: false // This is crucial. It ensures we manually acknowledge messages.
        });

    } catch (error) {
        console.error("Email worker failed to connect or start:", error);
    }
};

// Start the consumer
consumeEmailQueue();
