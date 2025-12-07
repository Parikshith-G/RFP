import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
console.log("Email User:", process.env.EMAIL_USER);

export const sendRfpEmail = async (vendorEmail, rfp) => {
  vendorEmail = "treeleafworm@gmail.com";
  const formattedJson = rfp.structuredRfp.mailMessage;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: vendorEmail,
    subject: `RFP: ${rfp.title} - Inquiry`,
    html: `
            <h2>Request for Proposal: ${rfp.title}</h2>
            ${formattedJson} 
        `,
  };

  await transporter.sendMail(mailOptions);
};
