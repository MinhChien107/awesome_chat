import nodeMailer from "nodemailer";

let adminEmail = process.env.MAIL_USER;
let adminPassword = process.env.MAIL_USER;
let mailHost = process.env.MAIL_HOST;
let mailPort = process.env.MAIL_PORT;

let sendMail = (to, subject, htmlContent)=> {
  let tranporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false,
    auth: {
      user: adminEmail,
      pass: adminPassword
    }
  });
  let options = {
    from: adminEmail,
    to,
    subject,
    html: htmlContent
  };

  return tranporter.sendMail(options); // this default return a promise
}

module.exports = sendMail;