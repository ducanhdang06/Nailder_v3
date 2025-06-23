import React from "react";
import ChatList from "../../components/Chat/ChatList";
import { useChatUser } from "../../hooks/useChatUser";
import {
  getChatParticipants,
  buildChatNavigationParams,
} from "../../utils/chatUtils";

const CustomerChat = ({ navigation }) => {
  const ENABLE_CHAT_QUERY = true;
  const { chats, loading, error, refetch, user, userId } =
    useChatUser(ENABLE_CHAT_QUERY);

  const handleChatPress = (chat) => {
    const { otherUser } = getChatParticipants(chat, userId, "customer");
    const navParams = buildChatNavigationParams(chat, otherUser, "customer");

    console.log("=== HANDLE CHAT PRESS DEBUG ===");
    console.log("Navigation object:", navigation);
    console.log("Navigation.navigate type:", typeof navigation.navigate);
    console.log("Chat data:", JSON.stringify(chat, null, 2));
    console.log("Navigation params:", navParams);
    console.log("===============================");

    navigation.navigate("ChatScreen", navParams);
  };

  return (
    <ChatList
      chats={chats}
      loading={loading}
      error={error}
      refetch={refetch}
      user={user}
      userId={userId}
      onChatPress={handleChatPress}
      getChatParticipants={getChatParticipants}
      userType="customer"
      title="Messages"
      emptyTitle="No conversations yet"
      emptySubtitle="Start chatting with nail technicians about designs you love!"
      enableQuery={ENABLE_CHAT_QUERY}
    />
  );
};

export default CustomerChat;
