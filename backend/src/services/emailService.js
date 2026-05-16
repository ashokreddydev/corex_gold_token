import nodemailer from 'nodemailer';
import config from '../config/config.js';

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  }
  return transporter;
};

export const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = getTransporter();
    const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    await transporter.sendMail({
      from: config.email.user,
      to: email,
      subject: 'Verify Your Gold Token Account',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const sendBurnApprovalEmail = async (email, amount) => {
  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: config.email.user,
      to: email,
      subject: 'Your Burn Request Has Been Approved',
      html: `<p>Your request to burn ${amount} tokens has been approved.</p>`,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendBurnRejectionEmail = async (email, reason) => {
  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: config.email.user,
      to: email,
      subject: 'Your Burn Request Has Been Rejected',
      html: `<p>Your burn request was rejected. Reason: ${reason}</p>`,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
