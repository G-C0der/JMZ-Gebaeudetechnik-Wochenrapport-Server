import nodemailer, {SentMessageInfo} from 'nodemailer';
import {smtpExchangeHost, smtpExchangePort, smtpExchangeEmail, smtpExchangePassword} from '../config/env';
import ejs from 'ejs';
import path from 'path';
import { escape } from 'lodash';

type Attachments = {
  filename: string;
  path: string;
}[];

class Mailer {
  private transport = nodemailer.createTransport({
    // @ts-ignore
    host: smtpExchangeHost,
    port: smtpExchangePort,
    auth: {
      user: smtpExchangeEmail,
      pass: smtpExchangePassword
    }
  });

  private renderEmail = async (templatePath: string, data: object = {}): Promise<string> => {
    try {
      const email: string = await ejs.renderFile(templatePath, data);
      return email;
    } catch (err) {
      console.error(`Error rendering email template. Error: ${err}`);
      throw err;
    }
  };

  private sendEmail = async (
    recipientEmail: string,
    subject: string,
    emailTemplatePath: string,
    emailData?: object,
    attachments?: Attachments
  ) => {
    try {
      const emailContent = await this.renderEmail(emailTemplatePath, emailData);
      const email = {
        sender: smtpExchangeEmail,
        from: smtpExchangeEmail,
        to: recipientEmail,
        subject,
        html: emailContent,
        ...(attachments && { attachments })
      };

      const { accepted, messageId } = await this.transport.sendMail(email);
      return { accepted, messageId };
    } catch (err) {
      console.error(`Error sending email. Error: ${err}`);
      return {};
    }
  };

  private wasEmailSent = (response: SentMessageInfo, recipientEmail: string) =>
    !!((response.accepted && response.accepted[0] === recipientEmail) && response.messageId);

  sendVerificationPendingEmail = async (userEmail: string, verificationUrl: string) => {
    const templatePath = path.join(__dirname, '../templates/verificationPendingEmail.ejs');
    const response = await this.sendEmail(
      userEmail,
      'Wochenrapport - Verifiziere Deinen User Account',
      templatePath,
      { verificationUrl }
    );
    return this.wasEmailSent(response, userEmail);
  };

  sendRegistrationDoneEmail = async (jmzEmail: string, userEmail: string) => {
    const templatePath = path.join(__dirname, '../templates/registrationDoneEmail.ejs');
    const response = await this.sendEmail(
      jmzEmail,
      'Wochenrapport - Ein User Account Wurde Erstellt',
      templatePath,
      { userEmail: escape(userEmail) }
    );
    return this.wasEmailSent(response, jmzEmail);
  };

  sendPasswordResetPendingEmail = async (userEmail: string, passwordResetUrl: string) => {
    const templatePath = path.join(__dirname, '../templates/passwordResetPendingEmail.ejs');
    const response = await this.sendEmail(
      userEmail,
      'Wochenrapport - Setze Dein User Account Password Zurück',
      templatePath,
      { passwordResetUrl }
    );
    return this.wasEmailSent(response, userEmail);
  };
}

export default new Mailer();
