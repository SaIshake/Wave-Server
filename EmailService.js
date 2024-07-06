// emailService.js

const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Update with the appropriate SMTP host for the email service provider
  port: 465, // Update with the appropriate SMTP port
  secure: true, // Use SSL/TLS
  auth: {
    user: 'aizakkusan2003@gmail.com', // Update with your email address
    pass: 'wrjcusxhonjggtzt' // Update with your email password
  }
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: 'aizakkusan2003@example.com', // Update with your email address
    to,
    subject,
    html,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}

module.exports = {
  sendEmail
};