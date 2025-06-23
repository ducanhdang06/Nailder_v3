import { StyleSheet } from "react-native";

export const chatStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Account for bottom navigation
  },

  // Chat card styles
  chatCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
  },

  // Image styles
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  designImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    borderRadius: 12,
  },
  placeholderImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#fdf2f8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fce7f3",
  },
  placeholderText: {
    fontSize: 28,
  },
  unreadDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fb7185',
    borderWidth: 2,
    borderColor: '#fff',
  },

  // Chat info styles
  chatInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  timeContainer: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
  },
  designTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fb7185",
    marginBottom: 6,
  },
  lastMessage: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  youText: {
    fontWeight: "600",
    color: "#9ca3af",
  },
  noMessages: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
  },

  // Status styles
  statusContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // State container styles
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ef4444",
    marginBottom: 8,
    textAlign: "center",
  },
  errorDetails: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  retryGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
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
});