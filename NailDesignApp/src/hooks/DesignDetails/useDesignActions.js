import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_BASE_URL } from "../../config";
import { fetchAuthSession } from "aws-amplify/auth";
import { useSavedStore } from "../../store/savedStore";
import { contactService } from "../../services/contactService";
import { useUnsaveDesign } from "./useUnsaveDesign";
import { useUser } from "../../context/userContext";

export const useDesignActions = (design, navigation) => {
  const { user } = useUser();
  const { removeDesign } = useSavedStore();
  const unsaveActions = useUnsaveDesign(design, navigation);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Debug the design object passed to this hook
  console.log("=== USE DESIGN ACTIONS DEBUG ===");
  console.log("Design object received:", JSON.stringify(design, null, 2));
  console.log("Design object type:", typeof design);
  console.log("Design keys:", design ? Object.keys(design) : "design is null/undefined");
  console.log("================================");

  const handleContactNow = useCallback(async () => {
    console.log("=== HANDLE CONTACT NOW DEBUG ===");
    console.log("Design in handleContactNow:", JSON.stringify(design, null, 2));
    console.log("Design type:", typeof design);
    console.log("=================================");
    
    try {
      // Use the existing contactService but we need to modify it slightly
      const result = await contactService.contactDesigner(design, navigation);
    } catch (error) {
      console.error("Failed to start chat:", error);
      Alert.alert("Error", "Failed to start chat. Please try again.");
    }
  }, [design, navigation]);

  return {
    handleContactNow,
    ...unsaveActions,
  };
};
