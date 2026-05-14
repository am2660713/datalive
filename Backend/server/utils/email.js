import nodemailer from "nodemailer";

const requiredEmailEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];

export const isEmailConfigured = () =>
  requiredEmailEnv.every((key) => Boolean(process.env[key]));

export const sendPasswordResetEmail = async ({ email, name, resetCode }) => {
  if (!isEmailConfigured()) {
    throw new Error("Email service is not configured");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to: email,
    subject: "Your DataLive password reset code",
    text: `Hi ${name || "there"},\n\nYour DataLive password reset code is ${resetCode}.\n\nThis code expires in 10 minutes. If you did not request this, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
        <h2>DataLive password reset</h2>
        <p>Hi ${name || "there"},</p>
        <p>Your password reset code is:</p>
        <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${resetCode}</p>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
};
