import React from "react";
import { FlatList } from "react-native";
import MessageItem from "./MessageItem";

const MessageList = ({ messages, currentUserId, flatListRef }) => {
  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MessageItem message={item} currentUserId={currentUserId} />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 10 }}
    />
  );
};

export default MessageList;