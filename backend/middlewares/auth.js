// Verify the AWS Cognito token from the frontend
// Ensure the user is authenticated before going to the protected routes

const jwt = require('jsonwebtoken'); 
// load the jsonwebtoken library to decode and verify jwt 
// will be used to check if the token sent by the user is valid

const jwksClient = require('jwks-rsa');
// help fetches public key from Cognito

require('dotenv').config();
// load the .env file

const client = jwksClient({
    jwksUri: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_POOL_ID}/.well-known/jwks.json`
  });
// create a jwks client to fetch the Cognito public keys

// not sure what this do
function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
  });
}

// not sure what this do
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
  
    jwt.verify(token, getKey, {}, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = decoded; // now contains Cognito sub, email, etc.
      next();
    });
  }
  
  module.exports = verifyToken;