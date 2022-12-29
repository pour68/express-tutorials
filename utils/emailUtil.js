// const nodemailer = require("nodemailer");
const {
  gmailSetting,
  mailOptionsWithHtml,
} = require("../settings/emailSetting");

// const transporter = nodemailer.createTransport(gmailSetting);

// transporter.sendMail(
//   mailOptionsWithHtml(
//     "ppour68@gmail.com",
//     ["user1@gmail.com", "user2@gmail.com"],
//     "subject",
//     "<h1>Good</h1>"
//   ),
//   function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent: " + info.response);
//     }
//   }
// );
