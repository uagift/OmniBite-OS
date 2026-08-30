/**
 * Role-Based Access Control (RBAC) Guard Middleware
 * Why it exists: Restricts user access strictly according to workspace privileges.
 * What it does: Matches user identities against an approved array of roles.
 * How it connects: Layered directly after the primary authMiddleware in routing paths.
 */

const responseHandler = require('../utils/responseHandler');

const roleMiddleware = (approvedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return responseHandler.error(res, 'Authorization data not present on request context', null, 500);
    }

    const hasAccess = approvedRoles.includes(req.user.role);
    if (!hasAccess) {
      return responseHandler.error(
        res, 
        `Access Forbidden: This operational loop is restricted to [${approvedRoles.join(', ')}] roles - your role is [${req.user.role || 'none'}]`, 
        null, 
        403
      );
    }

    next();
  };
};

module.exports = roleMiddleware;
