// src/config.js

const DEV_API_URL = 'http://localhost:3000';
const PROD_API_URL = 'https://api.yourdomain.com'; // Change to your production URL

export const API_BASE_URL =
  process.env.NODE_ENV === 'development' ? DEV_API_URL : PROD_API_URL;
