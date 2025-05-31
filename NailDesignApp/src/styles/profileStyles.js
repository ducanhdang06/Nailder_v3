import { StyleSheet, Platform } from "react-native";

export const profileStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingHorizontal: 20,
    },
    userInfoSection: {
      alignItems: "center",
      paddingVertical: 40,
      borderBottomWidth: 1,
      borderBottomColor: "#f3f4f6",
      marginBottom: 32,
    },
    userName: {
      fontSize: 28,
      fontWeight: "700",
      color: "#111827",
      marginBottom: 8,
      textAlign: "center",
    },
    userEmail: {
      fontSize: 16,
      color: "#6b7280",
      fontWeight: "500",
      marginBottom: 16,
      textAlign: "center",
    },
    badgeContainer: {
      backgroundColor: "#fef3c7",
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#fcd34d",
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "700",
      color: "#92400e",
      letterSpacing: 1,
    },
    actionsSection: {
      flex: 1,
    },
    actionButton: {
      backgroundColor: "#fff",
      borderRadius: 16,
      marginBottom: 12,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: "#f3f4f6",
    },
    actionContent: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    actionIcon: {
      fontSize: 24,
      marginRight: 16,
      width: 32,
      textAlign: "center",
    },
    actionTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "600",
      color: "#111827",
    },
    actionArrow: {
      fontSize: 24,
      color: "#9ca3af",
      fontWeight: "300",
    },
  });