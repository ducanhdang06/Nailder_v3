import { fetchAuthSession } from "aws-amplify/auth";
import { API_BASE_URL } from "../config";

export const submitDesign = async (designData) => {
  const token = (await fetchAuthSession()).tokens?.idToken?.toString();

  if (!token) {
    throw new Error("Authentication required. Please log in again.");
  }

  const response = await fetch(`${API_BASE_URL}/api/designs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(designData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit design");
  }

  return response.json();
};