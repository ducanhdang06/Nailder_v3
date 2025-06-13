import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@apollo/client";
import { useUser } from "../../context/userContext";
import { GET_USER_CHATS } from "../../graphql/chatQueries";
import { authStyles } from "../../styles/authStyles";
import { uploadStyles } from "../../styles/uploadStyles";
import { LinearGradient } from "expo-linear-gradient";

const TechnicianChat = ({ navigation }) => {
  const { user } = useUser();
  const userId = user?.sub;

  console.log("=== TECHNICIAN CHAT DEBUG ===");
  console.log("User object:", JSON.stringify(user, null, 2));
  console.log("User ID:", userId);
  console.log("User ID type:", typeof userId);
  console.log("Navigation from prop:", !!navigation);
  console.log("Navigation keys:", Object.keys(navigation));
  console.log("==============================");

  // Enable the query for technicians
  const ENABLE_CHAT_QUERY = true;

  // Fetch user chats
  const { data, loading, error, refetch } = useQuery(GET_USER_CHATS, {
    variables: { user_id: userId },
    skip: !userId || !ENABLE_CHAT_QUERY,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    pollInterval: ENABLE_CHAT_QUERY ? 5000 : 0,
    onError: (apolloError) => {
      console.error("=== GET_USER_CHATS ERROR (TECHNICIAN) ===");
      console.error("Error object:", JSON.stringify(apolloError, null, 2));
      console.error("Error message:", apolloError.message);
      console.error("GraphQL errors:", apolloError.graphQLErrors);
      console.error("Network error:", apolloError.networkError);
      console.error("Variables used:", { user_id: userId });
      console.error("=========================================");
    },
    onCompleted: (queryData) => {
      console.log("=== GET_USER_CHATS SUCCESS (TECHNICIAN) ===");
      console.log("Query completed successfully");
      console.log("Data received:", JSON.stringify(queryData, null, 2));
      console.log("Number of chats:", queryData?.getUserChats?.length || 0);
      console.log("===========================================");
    }
  });

  const handleChatPress = (chat) => {
    // Determine the other user (customer in this case)
    const isTechnician = chat.technician_id === userId;
    const otherUser = isTechnician ? chat.customer : chat.technician;
    const otherUserId = isTechnician ? chat.customer_id : chat.technician_id;
    
    console.log("=== TECHNICIAN HANDLE CHAT PRESS DEBUG ===");
    console.log("Navigation object:", navigation);
    console.log("Navigation.navigate type:", typeof navigation.navigate);
    console.log("Chat data:", JSON.stringify(chat, null, 2));
    console.log("Navigation params:", {
      chat_id: chat.id,
      customer_id: chat.customer_id,
      design: chat.design ? {
        id: chat.design.id,
        title: chat.design.title,
        imageUrl: chat.design.imageUrl,
        designerName: otherUser?.fullName
      } : null,
      otherUserName: otherUser?.fullName || "Customer",
      designTitle: chat.design?.title
    });
    console.log("==========================================");
    
    navigation.navigate("TechnicianChatScreen", {
      chat_id: chat.id,
      customer_id: chat.customer_id,
      design: chat.design ? {
        id: chat.design.id,
        title: chat.design.title,
        imageUrl: chat.design.imageUrl,
        designerName: otherUser?.fullName
      } : null,
      otherUserName: otherUser?.fullName || "Customer",
      designTitle: chat.design?.title
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "now";
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderChatItem = ({ item, index }) => {
    const isTechnician = item.technician_id === userId;
    const otherUser = isTechnician ? item.customer : item.technician;
    const lastMessage = item.lastMessage;
    const hasUnread = false; // TODO: Implement unread logic
    
    return (
      <TouchableOpacity 
        style={[styles.chatCard, { marginTop: index === 0 ? 16 : 8 }]}
        onPress={() => handleChatPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          {/* Design Image with Gradient Overlay */}
          <View style={styles.imageContainer}>
            {item.design?.imageUrl ? (
              <>
                <Image 
                  source={{ uri: item.design.imageUrl }} 
                  style={styles.designImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.3)']}
                  style={styles.imageOverlay}
                />
              </>
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>💅</Text>
              </View>
            )}
            {hasUnread && <View style={styles.unreadDot} />}
          </View>
          
          {/* Chat Info */}
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={styles.userName} numberOfLines={1}>
                {otherUser?.fullName || "Customer"}
              </Text>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>
                  {formatTime(lastMessage?.created_at || item.created_at)}
                </Text>
              </View>
            </View>
            
            <Text style={styles.designTitle} numberOfLines={1}>
              💅 {item.design?.title || "Design Discussion"}
            </Text>
            
            {lastMessage ? (
              <Text style={styles.lastMessage} numberOfLines={2}>
                {lastMessage.sender_id === userId ? (
                  <Text style={styles.youText}>You: </Text>
                ) : null}
                {lastMessage.content}
              </Text>
            ) : (
              <Text style={styles.noMessages}>Start the conversation...</Text>
            )}
          </View>
        </View>
        
        {/* Chat Status Indicator */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: hasUnread ? '#fb7185' : '#e5e7eb' }]} />
        </View>
      </TouchableOpacity>
    );
  };

  // Early return if no user
  if (!user || !userId) {
    console.log("❌ No user or userId, showing login prompt");
    return (
      <SafeAreaView style={authStyles.safeArea}>
        <View style={uploadStyles.pageHeader}>
          <Text style={uploadStyles.pageHeaderTitle}>Client Messages</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔐</Text>
          <Text style={styles.emptyTitle}>Please log in</Text>
          <Text style={styles.emptySubtitle}>
            Sign in to view your conversations with clients
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show temporary message while backend is being implemented
  if (!ENABLE_CHAT_QUERY) {
    return (
      <SafeAreaView style={authStyles.safeArea}>
        <View style={uploadStyles.pageHeader}>
          <Text style={uploadStyles.pageHeaderTitle}>Client Messages</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🚧</Text>
          <Text style={styles.emptyTitle}>Chat Feature Coming Soon</Text>
          <Text style={styles.emptySubtitle}>
            The chat list feature is currently being developed. You can still access individual chats through design details.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Loading state
  if (loading && !data) {
    console.log("🔄 Loading chats...");
    return (
      <SafeAreaView style={authStyles.safeArea}>
        <View style={uploadStyles.pageHeader}>
          <Text style={uploadStyles.pageHeaderTitle}>Client Messages</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fb7185" />
          <Text style={styles.loadingText}>Loading your client conversations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state with enhanced debugging
  if (error && !data) {
    console.log("❌ Error state triggered");
    console.log("Error details:", error);
    return (
      <SafeAreaView style={authStyles.safeArea}>
        <View style={uploadStyles.pageHeader}>
          <Text style={uploadStyles.pageHeaderTitle}>Client Messages</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Failed to load chats</Text>
          <Text style={styles.errorDetails}>
            {error.message || "Unknown error occurred"}
          </Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
            <LinearGradient
              colors={["#fb7185", "#ec4899"]}
              style={styles.retryGradient}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const chats = data?.getUserChats || [];

  return (
    <SafeAreaView style={authStyles.safeArea}>
      {/* Professional Header */}
      <View style={uploadStyles.pageHeader}>
        <Text style={uploadStyles.pageHeaderTitle}>Client Messages</Text>
      </View>
      
      <View style={styles.container}>
        {chats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>No client conversations yet</Text>
            <Text style={styles.emptySubtitle}>
              When clients message you about designs, conversations will appear here!
            </Text>
          </View>
        ) : (
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={renderChatItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshing={loading}
            onRefresh={refetch}
          />
        )}
      </View>
      
      {/* Bottom spacing */}
      <View style={{ height: 40 }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Account for bottom navigation
  },
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

export default TechnicianChat;
