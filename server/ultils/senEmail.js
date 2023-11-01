import nodemailer from "nodemailer";
import asynHandler from "express-async-handler";

const sendMail = asynHandler(async ({ email, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: '"cuahangdientu" <no-reply@cuahangdien.com>', // sender address
    to: email,
    subject: "Forgot Password",
    html: html,
  });
  return info;
});

export { sendMail };
