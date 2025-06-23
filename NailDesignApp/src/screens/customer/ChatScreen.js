import React from "react";
import { SafeAreaView } from "react-native";
import { useUser } from "../../context/userContext";
import { useChat } from "../../hooks/useChat";
import { 
  createOtherUserInfo, 
  createDesignInfo, 
  validateChatParams,
  getUserRole 
} from "../../utils/chatUtils";
import ChatHeader from "../../components/Chat/ChatHeader";
import MessageList from "../../components/Chat/MessageList";
import MessageInput from "../../components/Chat/MessageInput";
import { LoadingView, ErrorView, AuthErrorView } from "../../components/Chat/ChatLoadingError";
import { ChatScreenStyles } from "../../styles/chatScreenStyles";

const ChatScreen = ({ route, navigation }) => {
  // Get data from navigation
  const { chat_id, technician_id, design, otherUserName, designTitle } = route.params;
  
  // Get current user info
  const { user } = useUser();
  const userId = user?.sub;
  const currentUserRole = getUserRole(user);
  
  // Security check
  if (!user || !userId) {
    return <AuthErrorView userType="User" />;
  }

  // Validate required parameters
  if (!validateChatParams(chat_id, userId)) {
    return <AuthErrorView userType="Invalid parameters" />;
  }

  // Use chat hook for all chat functionality
  const {
    messageText,
    setMessageText,
    allMessages,
    loading,
    error,
    sendingMessage,
    handleSend,
    refetch,
    flatListRef,
  } = useChat(chat_id, userId);

  // Setup user and design info for display
  const otherUser = createOtherUserInfo(technician_id, otherUserName, currentUserRole);
  const designInfo = createDesignInfo(design, designTitle);

  // Loading state - only show on initial load
  if (loading && !allMessages.length) {
    return <LoadingView />;
  }

  // Error state
  if (error && !allMessages.length) {
    return <ErrorView error={error} onRetry={refetch} />;
  }

  // Main chat interface
  return (
    <SafeAreaView style={ChatScreenStyles.container}>
      <ChatHeader
        onBack={() => navigation.goBack()}
        otherUser={otherUser}
        design={designInfo}
        currentUserRole={currentUserRole}
      />

      <MessageList
        messages={allMessages}
        currentUserId={userId}
        flatListRef={flatListRef}
      />

      <MessageInput
        messageText={messageText}
        setMessageText={setMessageText}
        onSend={handleSend}
        sendingMessage={sendingMessage}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;