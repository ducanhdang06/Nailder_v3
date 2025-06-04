import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { contactService } from "../../services/contactService";
import { useUnsaveDesign } from "./useUnsaveDesign";

export const useDesignActions = (design, navigation) => {
  const unsaveActions = useUnsaveDesign(design, navigation);

  const handleContactNow = useCallback(async () => {    
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
