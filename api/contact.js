const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required.' });
        }

        // Configure the transporter
        // You will need to set EMAIL_USER and EMAIL_PASS in your .env file.
        // If using Gmail, EMAIL_PASS should be an "App Password" (not your regular login password).
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this to 'hotmail', 'yahoo', etc.
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address (your email)
            to: 'muhammadabubakar85033@gmail.com', // Your receiving email
            replyTo: email, // This allows you to hit "Reply" and email the visitor back directly
            subject: `New Portfolio Contact Form Submission from ${name}`,
            text: `You have received a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <h3>New Portfolio Contact</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <br>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Email sending error:', error);
        return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
};
