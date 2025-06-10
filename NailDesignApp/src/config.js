// src/config.js

const DEV_API_URL = 'https://f49b-2001-ee0-4141-ef7f-b0cb-1d2a-1c2c-3d01.ngrok-free.app';
const PROD_API_URL = 'https://api.yourdomain.com'; // Change to your production URL

export const API_BASE_URL =
  process.env.NODE_ENV === 'development' ? DEV_API_URL : PROD_API_URL;
