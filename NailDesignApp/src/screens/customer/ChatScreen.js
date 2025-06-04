import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import {
  useQuery,
  useMutation,
  useApolloClient,
} from "@apollo/client";
import { useUser } from "../../context/userContext";
import ChatHeader from "../../components/Chat/ChatHeader";
import { GET_MESSAGES_BY_CHAT } from "../../graphql/chatQueries";
import { SEND_MESSAGE } from "../../graphql/mutations";
import { ChatScreenStyles } from "../../styles/chatScreenStyles";

const ChatScreen = ({ route, navigation }) => {
  const { chat_id, technician_id, design, otherUserName, designTitle } =
    route.params;
  const { user } = useUser();
  const userId = user?.sub;
  const currentUserRole = user?.role || user?.["custom:userType"];
  const client = useApolloClient();
  const [messageText, setMessageText] = useState("");
  const flatListRef = useRef();

  // Track optimistic messages to prevent flickering
  const [optimisticMessages, setOptimisticMessages] = useState(new Map());

  // Early return if no user
  if (!user || !userId) {
    return (
      <View style={ChatScreenStyles.errorContainer}>
        <Text style={ChatScreenStyles.errorText}>User not authenticated</Text>
      </View>
    );
  }

  // Fetch messages with optimized polling
  const { data, loading, error, refetch } = useQuery(GET_MESSAGES_BY_CHAT, {
    variables: { chat_id: chat_id },
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    pollInterval: 3000, // Reduced polling for better performance
    onCompleted: (queryData) => {
      // Clean up optimistic messages that now exist in real data
      const realMessageIds = new Set(
        queryData?.getMessagesByChat?.map((msg) => msg.id) || []
      );

      setOptimisticMessages((prev) => {
        const cleaned = new Map();
        for (const [id, msg] of prev) {
          if (!realMessageIds.has(id) && id.startsWith("temp-")) {
            cleaned.set(id, msg);
          }
        }
        return cleaned;
      });
    },
  });

  // User and design info from route params
  const otherUser = {
    id: technician_id,
    fullName:
      otherUserName ||
      (currentUserRole === "customer" ? "Nail Technician" : "Customer"),
    email: "contact@nailstudio.com",
  };

  const designInfo = design
    ? {
        id: design.id,
        title: design.title || designTitle,
        imageUrl: design.imageUrl,
        designerName: design.designerName,
      }
    : null;

  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    errorPolicy: "all",
    onError: (error) => {
      Alert.alert("Error", "Failed to send message. Please try again.");
    },
    onCompleted: (data) => {
      if (!data?.sendMessage) {
        console.warn(
          "No sendMessage data in response - this might indicate a backend issue"
        );
      }
    },
  });

  const handleSend = async () => {
    if (!messageText.trim() || sendingMessage) return;

    const messageContent = messageText.trim();
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    setMessageText(""); // Clear input immediately for better UX

    // Validate required fields before sending
    if (!chat_id || !userId) {
      console.error("Missing required fields:", { chat_id, userId });
      Alert.alert("Error", "Missing required information. Please try again.");
      setMessageText(messageContent); // Restore message
      return;
    }

    // Create optimistic message for immediate UI feedback
    const optimisticMessage = {
      id: tempId,
      chat_id: chat_id,
      sender_id: userId,
      content: messageContent,
      image_url: null,
      created_at: new Date().toISOString(),
      __typename: "Message",
    };

    // Add to optimistic messages immediately
    setOptimisticMessages((prev) =>
      new Map(prev).set(tempId, optimisticMessage)
    );

    try {
      const result = await sendMessage({
        variables: {
          chat_id: String(chat_id), // Ensure it's a string
          sender_id: String(userId), // Ensure it's a string
          content: messageContent,
          image_url: null,
        },
        update: (cache, { data: mutationData }) => {
          if (!mutationData?.sendMessage) {
            console.warn(
              " No sendMessage data in response - skipping cache update"
            );
            return;
          }

          const messageData = mutationData.sendMessage;

          // Validate that all required fields are present
          if (
            !messageData.id ||
            !messageData.chat_id ||
            !messageData.sender_id
          ) {
            console.error(" Incomplete message data from server:", {
              id: messageData.id,
              chat_id: messageData.chat_id,
              sender_id: messageData.sender_id,
              content: messageData.content,
            });
            console.warn("Skipping cache update due to incomplete data");
            return;
          }

          try {
            // Remove optimistic message since we have real response
            setOptimisticMessages((prev) => {
              const updated = new Map(prev);
              updated.delete(tempId);
              return updated;
            });

            // Read current cache
            const existingData = cache.readQuery({
              query: GET_MESSAGES_BY_CHAT,
              variables: { chat_id: chat_id },
            });

            if (existingData) {
              const existingMessages = existingData.getMessagesByChat || [];

              // Normalize message data to ensure all required fields are present
              const newMessage = {
                __typename: "Message",
                id: messageData.id,
                chat_id: messageData.chat_id,
                sender_id: messageData.sender_id,
                content: messageData.content,
                image_url: messageData.image_url,
                created_at: messageData.created_at,
              };

              console.log("Normalized message for cache:", newMessage);

              // Check for duplicates
              const messageExists = existingMessages.some(
                (msg) => msg.id === newMessage.id
              );

              if (!messageExists) {
                const updatedMessages = [...existingMessages, newMessage];

                cache.writeQuery({
                  query: GET_MESSAGES_BY_CHAT,
                  variables: { chat_id: chat_id },
                  data: {
                    getMessagesByChat: updatedMessages,
                  },
                });
              } else {
              }
            }
          } catch (cacheError) {
            console.error("Cache update failed:", cacheError);
            console.error("Cache error details:", {
              error: cacheError.message,
              mutationData: messageData,
              chatId: chat_id,
            });
          }
        },
      });
    } catch (error) {
      console.error("Failed to send message:", error);

      // Clean up optimistic message on error
      setOptimisticMessages((prev) => {
        const updated = new Map(prev);
        updated.delete(tempId);
        return updated;
      });

      // Restore message text so user can retry
      setMessageText(messageContent);
    }
  };

  // Combine real and optimistic messages
  const allMessages = React.useMemo(() => {
    const realMessages = data?.getMessagesByChat || [];
    const optimisticArray = Array.from(optimisticMessages.values());

    // Combine and sort by timestamp
    const combined = [...realMessages, ...optimisticArray];
    return combined.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  }, [data?.getMessagesByChat, optimisticMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (allMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [allMessages.length]);

  // Loading state
  if (loading && !data) {
    return (
      <SafeAreaView style={ChatScreenStyles.container}>
        <Text style={ChatScreenStyles.loadingText}>Loading chat...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <SafeAreaView style={ChatScreenStyles.container}>
        <View style={ChatScreenStyles.errorContainer}>
          <Text style={ChatScreenStyles.errorText}>Error loading messages</Text>
          <Text style={ChatScreenStyles.errorText}>{error.message}</Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={ChatScreenStyles.retryButton}
          >
            <Text style={ChatScreenStyles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={ChatScreenStyles.container}>
      {/* Header */}
      <ChatHeader
        onBack={() => navigation.goBack()}
        otherUser={otherUser}
        design={designInfo}
        currentUserRole={currentUserRole}
      />

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={allMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSent = item.sender_id === userId;
          const isOptimistic = item.id.startsWith("temp-");

          return (
            <View
              style={[
                ChatScreenStyles.messageBubble,
                isSent ? ChatScreenStyles.sent : ChatScreenStyles.received,
                isOptimistic && ChatScreenStyles.optimistic,
              ]}
            >
              <Text
                style={[ChatScreenStyles.messageText, isSent && ChatScreenStyles.sentMessageText]}
              >
                {item.content}
              </Text>
              <Text style={[ChatScreenStyles.timeText, isSent && ChatScreenStyles.sentTimeText]}>
                {new Date(item.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {isOptimistic && " ⏳"}
              </Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      />

      {/* Input Area */}
      <View style={ChatScreenStyles.inputContainer}>
        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          style={ChatScreenStyles.input}
          multiline
          maxLength={1000}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          onPress={handleSend}
          style={[
            ChatScreenStyles.sendButton,
            (sendingMessage || !messageText.trim()) &&
              ChatScreenStyles.sendButtonDisabled,
          ]}
          disabled={sendingMessage || !messageText.trim()}
        >
          <Text style={ChatScreenStyles.sendButtonText}>
            {sendingMessage ? "..." : "Send"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;