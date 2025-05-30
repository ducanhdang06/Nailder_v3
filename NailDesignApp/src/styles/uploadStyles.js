import { StyleSheet, Platform } from "react-native";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
export const uploadStyles = {
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: 40,
    },
    pageHeader: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 4,
      alignItems: "flex-start",
    },
    containerWithoutCard: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 20,
    },
    backButton: {
      alignItems: "center",
      marginTop: 32,
      marginBottom: 20,
    },
    imagePreviewContainer: {
      alignItems: "center",
      marginVertical: 12,
    },
    mainImagePreview: {
      width: width - 120,
      height: width - 120,
      borderRadius: 16,
      resizeMode: "cover",
    },
    extraImagesContainer: {
      marginVertical: 12,
    },
    extraImageWrapper: {
      position: "relative",
      marginRight: 12,
    },
    extraImagePreview: {
      width: 80,
      height: 80,
      borderRadius: 12,
      resizeMode: "cover",
    },
    removeImageButton: {
      position: "absolute",
      top: -8,
      right: -8,
      backgroundColor: "#ef4444",
      borderRadius: 12,
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    removeImageText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
    },
    secondaryButton: {
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: "center",
      marginTop: 8,
    },
    secondaryButtonText: {
      fontSize: 15,
      fontWeight: "500",
      color: "#374151",
    },
    disabledText: {
      color: "#9ca3af",
    },
    helperText: {
      fontSize: 12,
      color: "#6b7280",
      marginBottom: 8,
    },
    characterCount: {
      fontSize: 12,
      color: "#6b7280",
      textAlign: "right",
      marginTop: 4,
    },
    textArea: {
      height: 80,
      textAlignVertical: "top",
      paddingTop: 12,
    },
    tagInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    tagInput: {
      flex: 1,
      marginBottom: 0,
    },
    addTagButton: {
      borderRadius: 8,
    },
    addTagGradient: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    addTagText: {
      color: "white",
      fontSize: 14,
      fontWeight: "500",
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 12,
    },
    tagChip: {
      backgroundColor: "#fdf2f8",
      borderColor: "#f9a8d4",
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      margin: 4,
      flexDirection: "row",
      alignItems: "center",
    },
    tagText: {
      fontSize: 13,
      color: "#be185d",
      fontWeight: "500",
    },
    removeTagText: {
      fontSize: 12,
      color: "#be185d",
      marginLeft: 4,
    },
    pageHeaderTitle: {
      fontSize: 32,
      fontWeight: "700",
      color: "#1f2937",
      letterSpacing: 0.5,
    },
  };
