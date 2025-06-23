import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Alert } from "react-native";
import { GET_MESSAGES_BY_CHAT } from "../graphql/chatQueries";
import { SEND_MESSAGE } from "../graphql/mutations";

export const useChat = (chat_id, userId) => {
  const [messageText, setMessageText] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState(new Map());
  const flatListRef = useRef();

  // Fetch messages from server
  const { data, loading, error, refetch } = useQuery(GET_MESSAGES_BY_CHAT, {
    variables: { chat_id },
    errorPolicy: "all",
    notifyOnNetworkStatusChange: false, // Don't show loading for polling
    fetchPolicy: "cache-and-network",
    pollInterval: 3000,
    onCompleted: (queryData) => {
      // Clean up optimistic messages that are now real
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

  // Setup message sending mutation
  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    errorPolicy: "all",
    onError: (error) => {
      Alert.alert("Error", "Failed to send message. Please try again.");
    },
    onCompleted: (data) => {
      if (!data?.sendMessage) {
        console.warn("No sendMessage data in response - this might indicate a backend issue");
      }
    },
  });

  // Handle sending messages
  const handleSend = async () => {
    if (!messageText.trim() || sendingMessage) return;

    const messageContent = messageText.trim();
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    setMessageText("");

    if (!chat_id || !userId) {
      console.error("Missing required fields:", { chat_id, userId });
      Alert.alert("Error", "Missing required information. Please try again.");
      setMessageText(messageContent);
      return;
    }

    // Create optimistic message
    const optimisticMessage = {
      id: tempId,
      chat_id: chat_id,
      sender_id: userId,
      content: messageContent,
      image_url: null,
      created_at: new Date().toISOString(),
      __typename: "Message",
    };

    setOptimisticMessages((prev) => new Map(prev).set(tempId, optimisticMessage));

    try {
      await sendMessage({
        variables: {
          chat_id: String(chat_id),
          sender_id: String(userId),
          content: messageContent,
          image_url: null,
        },
        update: (cache, { data: mutationData }) => {
          if (!mutationData?.sendMessage) {
            console.warn("No sendMessage data in response - skipping cache update");
            return;
          }

          const messageData = mutationData.sendMessage;

          if (!messageData.id || !messageData.chat_id || !messageData.sender_id) {
            console.error("Incomplete message data from server:", messageData);
            console.warn("Skipping cache update due to incomplete data");
            return;
          }

          try {
            // Remove optimistic message
            setOptimisticMessages((prev) => {
              const updated = new Map(prev);
              updated.delete(tempId);
              return updated;
            });

            // Update cache
            const existingData = cache.readQuery({
              query: GET_MESSAGES_BY_CHAT,
              variables: { chat_id: chat_id },
            });

            if (existingData) {
              const existingMessages = existingData.getMessagesByChat || [];
              const newMessage = {
                __typename: "Message",
                id: messageData.id,
                chat_id: messageData.chat_id,
                sender_id: messageData.sender_id,
                content: messageData.content,
                image_url: messageData.image_url,
                created_at: messageData.created_at,
              };

              const messageExists = existingMessages.some((msg) => msg.id === newMessage.id);

              if (!messageExists) {
                const updatedMessages = [...existingMessages, newMessage];
                cache.writeQuery({
                  query: GET_MESSAGES_BY_CHAT,
                  variables: { chat_id: chat_id },
                  data: { getMessagesByChat: updatedMessages },
                });
              }
            }
          } catch (cacheError) {
            console.error("Cache update failed:", cacheError);
          }
        },
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setOptimisticMessages((prev) => {
        const updated = new Map(prev);
        updated.delete(tempId);
        return updated;
      });
      setMessageText(messageContent);
    }
  };

  // Combine all messages for display
  const allMessages = useMemo(() => {
    const realMessages = data?.getMessagesByChat || [];
    const optimisticArray = Array.from(optimisticMessages.values());
    const combined = [...realMessages, ...optimisticArray];
    return combined.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }, [data?.getMessagesByChat, optimisticMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (allMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [allMessages.length]);

  return {
    messageText,
    setMessageText,
    allMessages,
    loading,
    error,
    sendingMessage,
    handleSend,
    refetch,
    flatListRef,
  };
};