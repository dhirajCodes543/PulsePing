import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "90356d001@smtp-brevo.com", 
    pass: process.env.SMTP_PASS      
  }
});

export const sendAlertEmail = async (to, subject, message) => {
  try {
    const info = await transporter.sendMail({
      from: '"Pulse Ping" <dhiraj99909@gmail.com>', 
      to,
      subject,
      text: message
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Email failed:", err);
  }
};
