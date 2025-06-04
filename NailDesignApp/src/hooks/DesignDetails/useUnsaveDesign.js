import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useSavedStore } from "../../store/savedStore";
import { savedDesignsApi } from "../../services/savedDesigns";

export const useUnsaveDesign = (design, navigation) => {
  const { removeDesign } = useSavedStore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const performUnsave = useCallback(async () => {
    try {
      // Optimistically remove the design from local state first
      removeDesign(design.id);
      
      // Navigate back immediately for better UX
      navigation.goBack();

      await savedDesignsApi.unsaveDesign(design.id);
      console.log("✅ Design unsaved:", design.id);
    } catch (error) {
      console.error("Failed to unsave design:", error);
      Alert.alert("Error", "Failed to unsave design. Please try again.");
      // Note: The focus effect in CustomerSaved will refetch and show the correct state
    }
  }, [design.id, navigation, removeDesign]);

  const handleUnsave = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  return {
    performUnsave,
    handleUnsave,
    showConfirmModal,
    handleCloseModal,
  };
};