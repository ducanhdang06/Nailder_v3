// src/config.js

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
export const GRAPHQL_ENDPOINT = process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT;

// Optional: Add some validation
if (!API_BASE_URL || !GRAPHQL_ENDPOINT) {
  throw new Error('Missing required environment variables');
}
