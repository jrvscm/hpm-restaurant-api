const nodemailer = require('nodemailer');

// Configure transporter with Gmail SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter configuration error:', error.message);
  } else {
    console.log('Email transporter configured successfully');
  }
});

// Function to send an email
const sendEmail = async ({ to, subject, htmlBody, textBody }) => {
  try {
    const info = await transporter.sendMail({
      from: '"Your Company Name" <your-email@gmail.com>',
      to,
      subject,
      html: htmlBody,
      text: textBody,
    });
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
