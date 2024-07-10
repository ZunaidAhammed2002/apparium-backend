import nodemailer from "nodemailer";

async function sendSupportMessage(leadName, recipientEmail) {
  let config = {
    service: "gmail",
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_EMAIL_PASS,
    },
  };
  let transporter = nodemailer.createTransport(config);

  // Prepare email options
  let mailOptions = {
    from: process.env.MAILER_EMAIL, // Sender address
    to: recipientEmail, // List of receivers
    subject: "Thank you for your interest in Apparium!", // Subject line
    text: `Hi there!/Hi ${leadName},\n\nThank you for writing to us! We wholeheartedly appreciate your interest in Apparium. Expect a reply from us within the next 48 hours.\n\nStay growth hungry,\n\nTeam Apparium`, // Plain text body
    html: `<p>Hi there!/Hi ${leadName},</p><p>Thank you for writing to us! We wholeheartedly appreciate your interest in Apparium. Expect a reply from us within the next 48 hours.</p><p>Stay growth hungry,</p><p>Team Apparium</p>`, // HTML body
  };

  // Send email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
}

export { sendSupportMessage };
