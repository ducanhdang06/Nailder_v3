// src/config.js

const DEV_API_URL = 'https://59b3-103-160-79-2.ngrok-free.app';
const PROD_API_URL = 'https://api.yourdomain.com'; // Change to your production URL

export const API_BASE_URL =
  process.env.NODE_ENV === 'development' ? DEV_API_URL : PROD_API_URL;
