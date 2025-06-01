// src/config.js

const DEV_API_URL = 'https://cd0d-2001-ee0-4141-ef7f-d499-d8ba-e9-c1f7.ngrok-free.app';
const PROD_API_URL = 'https://api.yourdomain.com'; // Change to your production URL

export const API_BASE_URL =
  process.env.NODE_ENV === 'development' ? DEV_API_URL : PROD_API_URL;
