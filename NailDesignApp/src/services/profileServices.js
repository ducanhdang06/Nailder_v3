import { API_BASE_URL } from "../config";
import { fetchAuthSession } from "aws-amplify/auth";

export const profileServices = {
  async fetchMyProfile() {
    const token = (await fetchAuthSession()).tokens?.idToken?.toString();
    const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch profile");
    return await response.json();
  },

  async fetchTechnicianProfile(techId) {
    const token = (await fetchAuthSession()).tokens?.idToken?.toString();
    const response = await fetch(`${API_BASE_URL}/api/profile/${techId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch technician profile");
    return await response.json();
  },

  async updateMyProfile(profileData) {
    const token = (await fetchAuthSession()).tokens?.idToken?.toString();

    const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Failed to update profile:", errorText);
      throw new Error("Failed to update profile");
    }

    return await response.json(); // { message: "Profile updated successfully" }
  },
};
