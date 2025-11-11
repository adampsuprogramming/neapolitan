const { auth } = require('express-oauth2-jwt-bearer');

// Check if we're in production/deployed environment
const isProduction = process.env.NODE_ENV === 'production';

// Only initialize Auth0 JWT validation in production
let checkJwt;
if (isProduction) {
  checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
  });
}

// Conditional auth middleware - only enforces in production
const conditionalAuth = (req, res, next) => {
  if (isProduction) {
    return checkJwt(req, res, next);
  }
  // In test/dev, skip authentication
  next();
};

module.exports = { conditionalAuth };