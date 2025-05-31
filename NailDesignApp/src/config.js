// src/config.js

const DEV_API_URL = 'https://83b6-2001-ee0-4141-ef7f-b409-2071-ef7c-1cd8.ngrok-free.app';
const PROD_API_URL = 'https://api.yourdomain.com'; // Change to your production URL

export const API_BASE_URL =
  process.env.NODE_ENV === 'development' ? DEV_API_URL : PROD_API_URL;
