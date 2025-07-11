import { fetchAuthSession } from "aws-amplify/auth";
import { API_BASE_URL } from "../config";

const getAuthToken = async () => {
  return (await fetchAuthSession()).tokens?.idToken?.toString();
};

export const savedDesignsApi = {
  async getSavedDesigns() {
    const token = await getAuthToken();
    
    const res = await fetch(`${API_BASE_URL}/api/feed/saved`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return res.json();
  },

  async unsaveDesign(designId) {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/api/matches/unsave`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        design_id: designId,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to unsave design");
    }

    return response.json();
  },

  async searchFeed(limit = 10) {
    const token = await getAuthToken();
  
    const res = await fetch(`${API_BASE_URL}/api/feed/search-feed?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
  
    return res.json();
  },

  async fetchDesignDetail(designId) {
    const token = (await fetchAuthSession()).tokens?.idToken?.toString();

    const response = await fetch(`${API_BASE_URL}/api/designs/${designId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch design detail");
    }

    return await response.json();
  },
};