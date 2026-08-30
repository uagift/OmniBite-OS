/**
 * Transactional Email Dispatcher Service
 * Why it exists: Aggregates custom email macros, reads templates, injects content, and sends mail with retries.
 * What it does: Loads text/HTML templates, replaces variable placeholders, registers database logs under `notifications`, and retries transient SMTP disconnects.
 * How it connects: Triggered during core order/staff events by order and staff controllers or background tasks.
 */

const fs = require('fs');
const path = require('path');
const mailTransporter = require('../config/mail');
const db = require('../config/db');
const logger = require('../utils/logger');

class EmailService {
  /**
   * Helper to load template and replace mustache-like values {{myVal}}
   */
  async renderTemplate(templateName, replacements = {}) {
    try {
      const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
      
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Email template file not found at path: ${templatePath}`);
      }

      let templateContent = fs.readFileSync(templatePath, 'utf8');

      // Loop through replacement dictionary and replace tokens
      Object.keys(replacements).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        templateContent = templateContent.replace(regex, replacements[key]);
      });

      return templateContent;
    } catch (error) {
      logger.error(`Error compiling HTML email template: "${templateName}"`, error);
      throw error;
    }
  }

  /**
   * Dispatches email with automatic retry loop (Max 2 retries)
   */
  async sendEmailWithRetry(to, subject, htmlBody, maxRetries = 2) {
    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_FROM || '"Supa Menu Service" <noreply@supamenu.com>',
          to,
          subject,
          html: htmlBody
        };

        const result = await mailTransporter.sendMail(mailOptions);
        logger.info(`Email dispatched successfully on attempt ${attempt + 1}. Msg ID: ${result.messageId}`);
        return result;
      } catch (error) {
        attempt++;
        logger.warn(`SMTP transmission failed on attempt ${attempt}/${maxRetries + 1}. Error: ${error.message}`);
        if (attempt > maxRetries) {
          logger.error('SMTP max retries exhausted. Discarding mail deliverable.');
          throw error;
        }
        // Minimal wait-interval before retry: 1000ms
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  /**
   * Core execution dispatch that records records to DB
   */
  async send({ userId, restaurantId, to, subject, templateName, replacements = {}, type = 'system' }) {
    try {
      // 1. Compile HTML body
      const htmlBody = await this.renderTemplate(templateName, replacements);

      // 2. Dispatch email
      const dispatchResult = await this.sendEmailWithRetry(to, subject, htmlBody);

      // 3. Register email logs into Database notification table for full audit compliance
      if (userId) {
        await db.query(
          `INSERT INTO notifications (user_id, restaurant_id, title, message, type, is_read) 
           VALUES (?, ?, ?, ?, ?, 0)`,
          [userId, restaurantId || null, subject, `Standard system-mail delivery: ${subject}`, type]
        );
      }

      return true;
    } catch (error) {
      logger.error(`Failure executing email notification trigger! Target: <${to}>, Subject: "${subject}"`, error);
      // Even if email fails, record failure or system warnings without interrupting primary client order flow
      if (userId) {
        await db.query(
          `INSERT INTO notifications (user_id, restaurant_id, title, message, type, is_read) 
           VALUES (?, ?, ?, ?, ?, 0)`,
          [userId, restaurantId || null, `FAILED: ${subject}`, `Failed email dispatch: ${error.message}`, type]
        );
      }
      return false;
    }
  }
}

module.exports = new EmailService();
