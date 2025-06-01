import { fetchAuthSession } from "aws-amplify/auth";
import { API_BASE_URL } from "../config";

export const getPostedDesigns = async () => {
  const token = (await fetchAuthSession()).tokens?.idToken?.toString();
  const res = await fetch(`${API_BASE_URL}/api/designs/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data;
};
