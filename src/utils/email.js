const nodemailer = require('nodemailer');

// Configure transporter with Postmark SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.postmarkapp.com', // Postmark's SMTP server
  port: 587, // Port for TLS
  secure: false, // Use TLS
  auth: {
    user: '73f9812d-ba1c-44ae-bf95-3aab5de52b87', // Your Server API Token (as username)
    pass: '73f9812d-ba1c-44ae-bf95-3aab5de52b87', // Your Server API Token (as password)
  },
  tls: {
    rejectUnauthorized: false, // For testing purposes, disable TLS verification (not recommended in production)
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter configuration error:', error.message);
  } else {
    console.log('Email transporter configured successfully:', success);
  }
});

// Function to send an email
const sendEmail = async ({ to, subject, htmlBody, textBody }) => {
  try {
    const info = await transporter.sendMail({
      from: 'no-reply@example.com', // Replace with a verified sender address from Postmark
      to, // Recipient email address
      subject, // Email subject
      html: htmlBody, // HTML content of the email
      text: textBody, // Plain text content of the email (optional)
    });
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
