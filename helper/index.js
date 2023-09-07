const nodemailer = require('nodemailer');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');

const sendEmail = async (email, emailType, subject, userId) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }
    const salt = await bcryptjs.genSalt(10);
    const token = await bcryptjs.hash(email, salt);
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      }
    );

    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '',
        pass: '',
      },
    });

    const mailOptions = {
      from: 'rahul@gmail.com',
      to: email,
      subject: subject,
      html: `<p> Click <a href= "${process.env.DOMAIN}/change-password?token=${token}"> Here</a> to ${emailType}
        or copy paste the link below in the browser.
        <br>
        ${process.env.DOMAIN}/change-password?token=${token}
        </p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    return null;
  }
};

module.exports = sendEmail;
