const nodemailer = require('nodemailer');
const AppError = require('./AppError');

const sendEmail = async (options) => {
  // 1. In development, just log it to the console
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n=================================`);
    console.log(`[DEV MODE - EMAIL SIMULATION]`);
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);
    console.log(`=================================\n`);
    return;
  }

  // 2. In production, configure nodemailer
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `LivingHub <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.message
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email Sending Error:', error);
    // Throw an operational error so it's not swallowed silently
    throw new AppError('There was an error sending the email. Please try again later.', 500);
  }
};

module.exports = sendEmail;
