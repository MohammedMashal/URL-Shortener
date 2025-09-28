const nodemailer = require("nodemailer");

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.firstName = user.name.split(" ")[0];
    this.from = `${process.env.NAME_FROM} <${process.env.EMAIL_FROM}>`;
  }

  // Create transport
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Production → SendGrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    // Development → Mailtrap / Local SMTP
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send email
  async send(subject, text) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  // Specific emails
  async sendWelcome() {
    await this.send(
      "Welcome to our family 🎉",
      `Hi ${this.firstName},\n\nWelcome to our family, we're glad to have you 🎉🙏\nWe're all a big family here.\n\nIf you want to check your information please click this link:\n${this.url}`
    );
  }

  async sendResetPassword() {
    await this.send(
      "Your password reset link (valid for only 10 minutes)",
      `Hi ${this.firstName},\n\nForgot your password?\nSubmit a PATCH request with your new password and passwordConfirm to the following link:\n${this.url}`
    );
  }
}

module.exports = Email;
