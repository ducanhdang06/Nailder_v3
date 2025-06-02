import { StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export const detailsStyles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: 'transparent',
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    backIcon: {
      fontSize: 20,
      color: '#fb7185',
      fontWeight: 'bold',
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    imageSection: {
      backgroundColor: '#f9fafb',
    },
    imageContainer: {
      position: 'relative',
    },
    mainImage: {
      width: screenWidth,
      height: screenWidth * 0.8,
      backgroundColor: '#f0f0f0',
    },
    imageIndicators: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 12,
      gap: 8,
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#d1d5db',
    },
    activeIndicator: {
      backgroundColor: '#fb7185',
    },
    arrowButton: {
      position: 'absolute',
      top: '50%',
      transform: [{ translateY: -20 }],
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    leftArrow: {
      left: 16,
    },
    rightArrow: {
      right: 16,
    },
    arrowIcon: {
      fontSize: 32,
      color: '#fb7185',
      fontWeight: 'bold',
    },
    infoSection: {
      padding: 20,
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    title: {
      flex: 1,
      fontSize: 24,
      fontWeight: '700',
      color: '#111827',
      marginRight: 12,
      lineHeight: 32,
    },
    likesContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fef2f2',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    heartIcon: {
      fontSize: 16,
      marginRight: 4,
    },
    likesCount: {
      fontSize: 14,
      color: '#dc2626',
      fontWeight: '600',
    },
    designerSection: {
      marginBottom: 24,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
    },
    designerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    designerAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#6366f1',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    designerInfo: {
      flex: 1,
    },
    designerName: {
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 2,
    },
    designerEmail: {
      fontSize: 14,
      color: '#6b7280',
    },
    descriptionSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: '#4b5563',
      lineHeight: 24,
    },
    tagsSection: {
      marginBottom: 24,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tag: {
      backgroundColor: '#f1f5f9',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#e2e8f0',
    },
    tagText: {
      fontSize: 14,
      color: '#475569',
      fontWeight: '500',
    },
    dateSection: {
      marginBottom: 20,
    },
    dateText: {
      fontSize: 14,
      color: '#6b7280',
    },
    bottomSpacing: {
      height: 100, // Space for bottom buttons
    },
    bottomActions: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 16,
      paddingBottom: 32,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#f3f4f6',
      gap: 12,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    contactButton: {
      backgroundColor: '#fb7185',
    },
    contactButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    unsaveButton: {
      backgroundColor: '#f3f4f6',
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
    unsaveButtonText: {
      color: '#6b7280',
      fontSize: 16,
      fontWeight: '600',
    },
    imagePlaceholder: {
      backgroundColor: '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: 14,
      color: '#6b7280',
      marginTop: 8,
    },
  });