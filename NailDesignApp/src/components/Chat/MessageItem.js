import React from "react";
import { View, Text } from "react-native";
import { ChatScreenStyles } from "../../styles/chatScreenStyles";

const MessageItem = ({ message, currentUserId }) => {
  const isSent = message.sender_id === currentUserId;
  const isOptimistic = message.id.startsWith("temp-");

  return (
    <View
      style={[
        ChatScreenStyles.messageBubble,
        isSent ? ChatScreenStyles.sent : ChatScreenStyles.received,
        isOptimistic && ChatScreenStyles.optimistic,
      ]}
    >
      <Text
        style={[
          ChatScreenStyles.messageText,
          isSent && ChatScreenStyles.sentMessageText,
        ]}
      >
        {message.content}
      </Text>
      
      <Text
        style={[
          ChatScreenStyles.timeText,
          isSent && ChatScreenStyles.sentTimeText,
        ]}
      >
        {new Date(message.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
        {isOptimistic && " ⏳"}
      </Text>
    </View>
  );
};

export default MessageItem;