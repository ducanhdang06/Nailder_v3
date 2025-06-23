import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { authStyles } from "../../styles/authStyles";
import { uploadStyles } from "../../styles/uploadStyles";
import { chatStyles } from "../../styles/chatStyles";

export const LoadingState = ({ title = "Messages" }) => (
  <SafeAreaView style={authStyles.safeArea}>
    <View style={uploadStyles.pageHeader}>
      <Text style={uploadStyles.pageHeaderTitle}>{title}</Text>
    </View>
    <View style={chatStyles.loadingContainer}>
      <ActivityIndicator size="large" color="#fb7185" />
      <Text style={chatStyles.loadingText}>Loading your conversations...</Text>
    </View>
  </SafeAreaView>
);

export const ErrorState = ({ title = "Messages", error, onRetry }) => (
  <SafeAreaView style={authStyles.safeArea}>
    <View style={uploadStyles.pageHeader}>
      <Text style={uploadStyles.pageHeaderTitle}>{title}</Text>
    </View>
    <View style={chatStyles.errorContainer}>
      <Text style={chatStyles.errorIcon}>⚠️</Text>
      <Text style={chatStyles.errorTitle}>Failed to load chats</Text>
      <Text style={chatStyles.errorDetails}>
        {error.message || "Unknown error occurred"}
      </Text>
      <TouchableOpacity onPress={onRetry} style={chatStyles.retryButton}>
        <LinearGradient
          colors={["#fb7185", "#ec4899"]}
          style={chatStyles.retryGradient}
        >
          <Text style={chatStyles.retryText}>Try Again</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

export const EmptyState = ({ 
  title = "Messages", 
  icon = "💬", 
  emptyTitle = "No conversations yet", 
  emptySubtitle = "Start chatting with nail technicians about designs you love!" 
}) => (
  <SafeAreaView style={authStyles.safeArea}>
    <View style={uploadStyles.pageHeader}>
      <Text style={uploadStyles.pageHeaderTitle}>{title}</Text>
    </View>
    <View style={chatStyles.emptyContainer}>
      <Text style={chatStyles.emptyIcon}>{icon}</Text>
      <Text style={chatStyles.emptyTitle}>{emptyTitle}</Text>
      <Text style={chatStyles.emptySubtitle}>{emptySubtitle}</Text>
    </View>
  </SafeAreaView>
);

export const LoginPromptState = ({ title = "Messages", userType = "customer" }) => (
  <SafeAreaView style={authStyles.safeArea}>
    <View style={uploadStyles.pageHeader}>
      <Text style={uploadStyles.pageHeaderTitle}>{title}</Text>
    </View>
    <View style={chatStyles.emptyContainer}>
      <Text style={chatStyles.emptyIcon}>🔐</Text>
      <Text style={chatStyles.emptyTitle}>Please log in</Text>
      <Text style={chatStyles.emptySubtitle}>
        {userType.toLocaleLowerCase === 'customer' 
          ? "Sign in to view your conversations with nail technicians"
          : "Sign in to view your conversations with clients"
        }
      </Text>
    </View>
  </SafeAreaView>
);

export const ComingSoonState = ({ title = "Messages" }) => (
  <SafeAreaView style={authStyles.safeArea}>
    <View style={uploadStyles.pageHeader}>
      <Text style={uploadStyles.pageHeaderTitle}>{title}</Text>
    </View>
    <View style={chatStyles.emptyContainer}>
      <Text style={chatStyles.emptyIcon}>🚧</Text>
      <Text style={chatStyles.emptyTitle}>Chat Feature Coming Soon</Text>
      <Text style={chatStyles.emptySubtitle}>
        The chat list feature is currently being developed. You can still access individual chats through design details.
      </Text>
    </View>
  </SafeAreaView>
);