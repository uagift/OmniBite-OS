/**
 * SMTP Mail Transport Setup (Nodemailer)
 * Why it exists: Establishes a connection to the SMTP server for outgoing emails.
 * What it does: Configures a reusable Nodemailer transport object using environment settings.
 * How it connects: Imported by the email service to deliver formatted HTML system emails.
 */

const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const mailConfig = {
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || ''
  },
  secure: process.env.SMTP_PORT === '465' // True only for SSL port 465
};

// Create transporter
let transporter;

try {
  // If SMTP configs are not defined, create a direct log carrier or Ethereal fallback
  if (!mailConfig.auth.user) {
    logger.warn('SMTP Credentials missing. Initializing dummy logger-based mail transporter.');
    transporter = {
      sendMail: async (mailOptions) => {
        logger.info(`[Email Dispatch Mocked]`, {
          to: mailOptions.to,
          subject: mailOptions.subject,
          text: mailOptions.text ? mailOptions.text.slice(0, 100) : 'HTML body present...'
        });
        return { messageId: 'mock-id-' + Date.now() };
      }
    };
  } else {
    transporter = nodemailer.createTransport(mailConfig);
    // Verify connection on startup without crashing on network timeout
    transporter.verify((error, success) => {
      if (error) {
        logger.warn('SMTP server handshake issues detected. Check credentials or ports.', error.message);
      } else {
        logger.info(`SMTP Mail carrier connected and prepared to dispatch from: ${process.env.EMAIL_FROM || mailConfig.auth.user}`);
      }
    });
  }
} catch (error) {
  logger.error('Nodemailer setup failed. Mail client is in degraded fallback state:', error);
}

module.exports = transporter;
