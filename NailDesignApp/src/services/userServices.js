// Purpose: Handles API calls related to user operations

// Responsibilities:
// Creates/updates user in backend database
// Manages API authentication with tokens
// Handles API error responses

import { API_BASE_URL } from "../../src/config";

export const userApiService = {
  async createOrUpdateUser({ fullName, email, role, token }) {
    try {
      console.log("Creating/updating user via API");
      
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          role: role,
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error("User API error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};