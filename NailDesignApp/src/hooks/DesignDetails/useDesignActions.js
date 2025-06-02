import { useCallback } from "react";
import { Alert } from "react-native";
import { API_BASE_URL } from "../../config";
import { fetchAuthSession } from "aws-amplify/auth";
import { useSavedStore } from "../../store/savedStore";

export const useDesignActions = (design, navigation) => {
  const { removeDesign } = useSavedStore();

  const handleContactNow = useCallback(() => {
    // TODO: Implement contact functionality
    // This could navigate to a contact screen, open email client, etc.
    console.log("Contact designer:", design.designerName);

    // Example implementation:
    // navigation.navigate('ContactDesigner', {
    //   designerId: design.designerId,
    //   designerName: design.designerName,
    //   designerEmail: design.designerEmail
    // });
  }, [design.designerName]);

  const handleUnsave = useCallback(async () => {
    const token = (await fetchAuthSession()).tokens?.idToken?.toString();

    try {
      // Optimistically remove the design from local state first
      removeDesign(design.id);
      
      // Navigate back immediately for better UX
      navigation.goBack();

      const response = await fetch(`${API_BASE_URL}/api/matches/unsave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // if you're using token auth
        },
        body: JSON.stringify({
          design_id: design.id,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to unsave design");
      }

      console.log("✅ Design unsaved:", design.id);
    } catch (error) {
      console.error("❌ Failed to unsave design:", error);
      Alert.alert("Error", "Failed to unsave design. Please try again.");
      // Note: The focus effect in CustomerSaved will refetch and show the correct state
    }
  }, [design.id, navigation, removeDesign]);

  return {
    handleContactNow,
    handleUnsave,
  };
};
