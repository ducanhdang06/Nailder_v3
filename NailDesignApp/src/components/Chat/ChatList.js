import React from "react";
import {
  View,
  FlatList,
  SafeAreaView,
  Text,
} from "react-native";
import ChatCard from "./ChatCard";
import { 
  LoadingState, 
  ErrorState, 
  EmptyState, 
  LoginPromptState, 
  ComingSoonState 
} from "./ChatStates";
import { authStyles } from "../../styles/authStyles";
import { uploadStyles } from "../../styles/uploadStyles";
import { chatStyles } from "../../styles/chatStyles";

const ChatList = ({
  chats,
  loading,
  error,
  refetch,
  user,
  userId,
  onChatPress,
  getChatParticipants,
  userType = 'customer',
  title = 'Messages',
  emptyTitle = 'No conversations yet',
  emptySubtitle = 'Start chatting with nail technicians about designs you love!',
  enableQuery = true
}) => {

  const renderChatItem = ({ item, index }) => {
    const { otherUser } = getChatParticipants(item, userId, userType);
    
    return (
      <ChatCard
        chat={item}
        index={index}
        onPress={onChatPress}
        otherUser={otherUser}
        currentUserId={userId}
        userType={userType}
      />
    );
  };

  // Early return if no user
  if (!user || !userId) {
    console.log("❌ No user or userId, showing login prompt");
    return <LoginPromptState title={title} userType={userType} />;
  }

  // Show temporary message while backend is being implemented
  if (!enableQuery) {
    return <ComingSoonState title={title} />;
  }

  // Loading state
  if (loading && !chats.length) {
    console.log("🔄 Loading chats...");
    return <LoadingState title={title} />;
  }

  // Error state with enhanced debugging
  if (error && !chats.length) {
    console.log("❌ Error state triggered");
    console.log("Error details:", error);
    return <ErrorState title={title} error={error} onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={authStyles.safeArea}>
      {/* Professional Header */}
      <View style={uploadStyles.pageHeader}>
        <Text style={uploadStyles.pageHeaderTitle}>{title}</Text>
      </View>
      
      <View style={chatStyles.container}>
        {chats.length === 0 ? (
          <View style={chatStyles.emptyContainer}>
            <Text style={chatStyles.emptyIcon}>💬</Text>
            <Text style={chatStyles.emptyTitle}>{emptyTitle}</Text>
            <Text style={chatStyles.emptySubtitle}>{emptySubtitle}</Text>
          </View>
        ) : (
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={renderChatItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={chatStyles.listContainer}
            refreshing={loading}
            onRefresh={refetch}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatList;