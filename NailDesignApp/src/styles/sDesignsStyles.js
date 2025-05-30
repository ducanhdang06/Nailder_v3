import { StyleSheet } from "react-native";

export const sDesignsStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: '#6b7280',
      fontWeight: '500',
    },
    list: {
      paddingBottom: 20,
    },
    card: {
      flex: 1,
      margin: 6,
      backgroundColor: '#fff',
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: '#f3f4f6',
    },
    image: {
      height: 160,
      width: '100%',
      resizeMode: 'cover',
      backgroundColor: '#f9fafb',
    },
    cardContent: {
      padding: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 4,
      lineHeight: 20,
    },
    designer: {
      fontSize: 13,
      color: '#6b7280',
      fontWeight: '500',
      marginBottom: 6,
    },
    likes: {
      fontSize: 13,
      color: '#ec4899',
      fontWeight: '600',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#111827',
      textAlign: 'center',
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 16,
      color: '#6b7280',
      textAlign: 'center',
      lineHeight: 24,
      fontWeight: '500',
    },
  });