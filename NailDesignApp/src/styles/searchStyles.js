import { StyleSheet } from "react-native";

export const searchStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f9fafb",
    },
    searchContainer: {
      flexDirection: "row",
      padding: 16,
      alignItems: "center",
      gap: 12,
    },
    searchInput: {
      flex: 1,
      height: 48,
      backgroundColor: "#fff",
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      borderWidth: 1,
      borderColor: "#e5e7eb",
    },
    searchInputWithBack: {
      marginLeft: 0,
    },
    backButton: {
      width: 48,
      height: 48,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      marginRight: 8,
    },
    backButtonText: {
      fontSize: 20,
      color: "#6b7280",
      fontWeight: "400",
    },
    searchButton: {
      height: 48,
      minWidth: 80,
      borderRadius: 12,
      overflow: "hidden",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    searchButtonGradient: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: "center",
      justifyContent: "center",
      height: 48,
    },
    searchButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
    recentSection: {
      flex: 1,
      paddingHorizontal: 16,
    },
    // Top Designs Styles
    topDesignsSection: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#111827",
    },
    seeAllButton: {
      fontSize: 14,
      color: "#fb7185",
      fontWeight: "600",
    },
    topDesignsList: {
      paddingRight: 16,
    },
    topDesignCard: {
      width: 180,
      backgroundColor: "#fff",
      borderRadius: 16,
      marginRight: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      overflow: "hidden",
    },
    designImageContainer: {
      position: "relative",
      height: 140,
    },
    designImage: {
      width: "100%",
      height: "100%",
      backgroundColor: "#f3f4f6",
    },
    designImageOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 50,
      justifyContent: "flex-end",
      padding: 12,
    },
    designLikes: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: "rgba(255,255,255,0.9)",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    likesIcon: {
      fontSize: 12,
      marginRight: 4,
    },
    likesCount: {
      fontSize: 12,
      fontWeight: "600",
      color: "#111827",
    },
    designInfo: {
      padding: 12,
    },
    designTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: "#111827",
      marginBottom: 4,
    },
    designCreator: {
      fontSize: 12,
      color: "#6b7280",
      marginBottom: 8,
    },
    tagsContainer: {
      flexDirection: "row",
    },
    tagChip: {
      backgroundColor: "#fef3f4",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginRight: 6,
      borderWidth: 1,
      borderColor: "#fecaca",
    },
    tagText: {
      fontSize: 10,
      color: "#dc2626",
      fontWeight: "500",
    },
    topDesignsLoading: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
    },
    loadingSmallText: {
      fontSize: 14,
      color: "#6b7280",
      marginLeft: 12,
      fontWeight: "500",
    },
    recentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    recentTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#111827",
    },
    clearButton: {
      fontSize: 14,
      color: "#fb7185",
      fontWeight: "600",
    },
    recentSearchItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 12,
      marginBottom: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    recentSearchButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    recentSearchContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    searchIcon: {
      fontSize: 16,
      marginRight: 12,
      color: "#6b7280",
    },
    recentSearchText: {
      fontSize: 16,
      color: "#111827",
      flex: 1,
    },
    recentSearchTime: {
      fontSize: 12,
      color: "#9ca3af",
    },
    removeButton: {
      padding: 16,
      paddingLeft: 8,
    },
    removeButtonText: {
      fontSize: 18,
      color: "#9ca3af",
      fontWeight: "300",
    },
    resultsList: {
      flex: 1,
      paddingHorizontal: 16,
    },
    searchResultItem: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    searchResultTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#111827",
      marginBottom: 4,
    },
    searchResultType: {
      fontSize: 14,
      color: "#6b7280",
      textTransform: "capitalize",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    loadingText: {
      fontSize: 16,
      color: "#6b7280",
      marginTop: 16,
      fontWeight: "500",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 24,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: "#111827",
      marginBottom: 12,
      textAlign: "center",
    },
    emptySubtitle: {
      fontSize: 16,
      color: "#6b7280",
      textAlign: "center",
      lineHeight: 24,
      fontWeight: "500",
    },
    rankingBadge: {
      position: "absolute",
      top: 8,
      left: 8,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    rankingIcon: {
      fontSize: 14,
      marginRight: 2,
    },
    rankingText: {
      fontSize: 11,
      color: "#fff",
      fontWeight: "700",
      textShadowColor: "rgba(0,0,0,0.5)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    
    // ===== SEARCH RESULT CARD STYLES =====
    designResultCard: {
      flexDirection: "row",
      backgroundColor: "#fff",
      borderRadius: 16,
      marginBottom: 12,
      padding: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      overflow: "hidden",
    },
    
    resultImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
      backgroundColor: "#f3f4f6",
      marginRight: 12,
    },
    
    resultContent: {
      flex: 1,
      justifyContent: "space-between",
    },
    
    resultHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 4,
    },
    
    resultTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#111827",
      flex: 1,
      marginRight: 8,
    },
    
    resultLikes: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fef3f4",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    
    likesIcon: {
      fontSize: 10,
      marginRight: 2,
    },
    
    likesText: {
      fontSize: 11,
      fontWeight: "600",
      color: "#dc2626",
    },
    
    resultCreator: {
      fontSize: 13,
      color: "#6b7280",
      marginBottom: 6,
      fontWeight: "500",
    },
    
    resultDescription: {
      fontSize: 12,
      color: "#9ca3af",
      lineHeight: 16,
      marginBottom: 6,
    },
    
    resultTagsContainer: {
      flexDirection: "row",
      marginTop: 4,
    },
    
    resultTagChip: {
      backgroundColor: "#f3f4f6",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
      marginRight: 4,
    },
    
    resultTagText: {
      fontSize: 10,
      color: "#4b5563",
      fontWeight: "500",
    },
    
    // ===== TECHNICIAN RESULT CARD STYLES =====
    technicianResultCard: {
      flexDirection: "row",
      backgroundColor: "#fff",
      borderRadius: 16,
      marginBottom: 12,
      padding: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      overflow: "hidden",
    },
    
    technicianImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "#f3f4f6",
      marginRight: 12,
    },
    
    technicianContent: {
      flex: 1,
      justifyContent: "space-between",
    },
    
    technicianHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 4,
    },
    
    technicianName: {
      fontSize: 16,
      fontWeight: "600",
      color: "#111827",
      flex: 1,
      marginRight: 8,
    },
    
    ratingContainer: {
      alignItems: "flex-end",
    },
    
    ratingStars: {
      fontSize: 12,
      marginBottom: 2,
    },
    
    ratingText: {
      fontSize: 11,
      color: "#6b7280",
      fontWeight: "500",
    },
    
    technicianLocation: {
      fontSize: 13,
      color: "#6b7280",
      marginBottom: 6,
      fontWeight: "500",
    },
    
    technicianBio: {
      fontSize: 12,
      color: "#9ca3af",
      lineHeight: 16,
      marginBottom: 6,
    },
    
    specialtiesContainer: {
      flexDirection: "row",
      marginTop: 4,
    },
    
    specialtyChip: {
      backgroundColor: "#e0f2fe",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
      marginRight: 4,
      borderWidth: 1,
      borderColor: "#b3e5fc",
    },
    
    specialtyText: {
      fontSize: 10,
      color: "#0277bd",
      fontWeight: "500",
    },
  });