/**
 * QR Code Generation Service
 * Why it exists: Generates scannable QR tags that link physical tables directly to digital menus.
 * What it does: Creates optimized web-image links to render physical qr tags using a public cloud generator API.
 * How it connects: Triggered dynamically by restaurant tables setup or configuration queries.
 */

const logger = require('../utils/logger');

class QrService {
  /**
   * Generates a scannable table QR code URL
   * @param {string|number} restaurantId 
   * @param {string|number} tableNumber 
   * @returns {string} Fully qualified QR image link
   */
  generateTableQrUrl(restaurantId, tableNumber) {
    try {
      // client redirect link
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      const scanPayload = `${clientUrl}/menu?restaurantId=${restaurantId}&table=${tableNumber}`;
      
      // We leverage QRserver's fast, high-availability public API to produce professional 300x300 QR tags.
      const encodedPayload = encodeURIComponent(scanPayload);
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedPayload}&margin=10`;
      
      logger.info(`Generated table QR code for Restaurant #${restaurantId}, Table ${tableNumber}`);
      return qrImageUrl;
    } catch (error) {
      logger.error('Error generating Table QR URL content representation', error);
      // Fail gracefully with a safe Google chart fallback
      return `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(`restaurant:${restaurantId}:table:${tableNumber}`)}`;
    }
  }
}

module.exports = new QrService();
