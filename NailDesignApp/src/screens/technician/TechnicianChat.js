import React from "react";
import ChatList from "../../components/Chat/ChatList";
import { useChatUser } from "../../hooks/useChatUser";
import { getChatParticipants, buildChatNavigationParams } from "../../utils/chatUtils";

const TechnicianChat = ({ navigation }) => {
  const ENABLE_CHAT_QUERY = true;
  const { chats, loading, error, refetch, user, userId } = useChatUser(ENABLE_CHAT_QUERY);

  console.log("=== TECHNICIAN CHAT DEBUG ===");
  console.log("User object:", JSON.stringify(user, null, 2));
  console.log("User ID:", userId);
  console.log("User ID type:", typeof userId);
  console.log("Navigation from prop:", !!navigation);
  console.log("Navigation keys:", Object.keys(navigation));
  console.log("==============================");

  const handleChatPress = (chat) => {
    const { otherUser } = getChatParticipants(chat, userId, 'technician');
    const navParams = buildChatNavigationParams(chat, otherUser, 'technician');
    
    console.log("=== TECHNICIAN HANDLE CHAT PRESS DEBUG ===");
    console.log("Navigation object:", navigation);
    console.log("Navigation.navigate type:", typeof navigation.navigate);
    console.log("Chat data:", JSON.stringify(chat, null, 2));
    console.log("Navigation params:", navParams);
    console.log("==========================================");
    
    navigation.navigate("TechnicianChatScreen", navParams);
  };

  return (
    <>
      <ChatList
        chats={chats}
        loading={loading}
        error={error}
        refetch={refetch}
        user={user}
        userId={userId}
        onChatPress={handleChatPress}
        getChatParticipants={getChatParticipants}
        userType="technician"
        title="Client Messages"
        emptyTitle="No client conversations yet"
        emptySubtitle="When clients message you about designs, conversations will appear here!"
        enableQuery={ENABLE_CHAT_QUERY}
      />
      {/* Bottom spacing */}
      <View style={{ height: 40 }} />
    </>
  );
};

export default TechnicianChat;
