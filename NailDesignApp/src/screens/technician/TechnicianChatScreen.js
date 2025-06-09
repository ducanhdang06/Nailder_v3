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

const TechnicianChatScreen = ({ route, navigation }) => {
  // ===== GET DATA FROM NAVIGATION =====
  // When technician navigates to this screen, they pass these parameters
  const { chat_id, customer_id, design, otherUserName, designTitle } = route.params;
  
  // ===== GET CURRENT USER INFO =====
  const { user } = useUser(); // Get logged-in technician info
  const userId = user?.sub; // Technician's unique ID
  const currentUserRole = user?.role || user?.["custom:userType"]; // Should be 'technician'
  
  // ===== SETUP APOLLO CLIENT =====
  const client = useApolloClient(); // For GraphQL operations
  
  // ===== LOCAL STATE VARIABLES =====
  const [messageText, setMessageText] = useState(""); // Text technician is typing
  const flatListRef = useRef(); // Reference to scroll the message list
  
  // ===== OPTIMISTIC MESSAGES =====
  // When technician sends a message, show it immediately before server confirms
  // This makes the app feel faster and more responsive
  const [optimisticMessages, setOptimisticMessages] = useState(new Map());

  // ===== SECURITY CHECK =====
  // If technician is not logged in, don't let them use chat
  if (!user || !userId) {
    return (
      <View style={ChatScreenStyles.errorContainer}>
        <Text style={ChatScreenStyles.errorText}>Technician not authenticated</Text>
      </View>
    );
  }

  // ===== FETCH MESSAGES FROM SERVER =====
  // This automatically gets all messages for this chat
  const { data, loading, error, refetch } = useQuery(GET_MESSAGES_BY_CHAT, {
    variables: { chat_id: chat_id }, // Tell server which chat we want
    errorPolicy: "all", // Don't crash if there's an error
    notifyOnNetworkStatusChange: true, // Update loading state
    fetchPolicy: "cache-and-network", // Use cache first, then network
    pollInterval: 3000, // Check for new messages every 3 seconds
    
    // ===== WHEN MESSAGES ARE LOADED =====
    onCompleted: (queryData) => {
      // Clean up any optimistic messages that are now real
      const realMessageIds = new Set(
        queryData?.getMessagesByChat?.map((msg) => msg.id) || []
      );

      setOptimisticMessages((prev) => {
        const cleaned = new Map();
        // Keep only optimistic messages that haven't become real yet
        for (const [id, msg] of prev) {
          if (!realMessageIds.has(id) && id.startsWith("temp-")) {
            cleaned.set(id, msg);
          }
        }
        return cleaned;
      });
    },
  });

  // ===== SETUP USER INFO FOR DISPLAY =====
  // Information about the customer we're chatting with
  const otherUser = {
    id: customer_id,
    fullName: otherUserName || "Customer",
    email: "customer@nailapp.com",
  };

  // ===== SETUP DESIGN INFO FOR DISPLAY =====
  // Information about the nail design being discussed
  const designInfo = design
    ? {
        id: design.id,
        title: design.title || designTitle,
        imageUrl: design.imageUrl,
        designerName: design.designerName,
      }
    : null;

  // ===== SETUP MESSAGE SENDING =====
  // This handles sending new messages to the server
  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    errorPolicy: "all", // Don't crash on errors
    
    // ===== IF SENDING FAILS =====
    onError: (error) => {
      Alert.alert("Error", "Failed to send message. Please try again.");
    },
    
    // ===== IF SENDING SUCCEEDS =====
    onCompleted: (data) => {
      if (!data?.sendMessage) {
        console.warn("No sendMessage data in response - this might indicate a backend issue");
      }
    },
  });

  // ===== MAIN FUNCTION TO SEND A MESSAGE =====
  const handleSend = async () => {
    // Don't send if message is empty or already sending
    if (!messageText.trim() || sendingMessage) return;

    const messageContent = messageText.trim(); // Remove extra spaces
    const tempId = `temp-${Date.now()}-${Math.random()}`; // Unique ID for optimistic message
    setMessageText(""); // Clear input box immediately (better user experience)

    // ===== SAFETY CHECK =====
    // Make sure we have all required information
    if (!chat_id || !userId) {
      console.error("Missing required fields:", { chat_id, userId });
      Alert.alert("Error", "Missing required information. Please try again.");
      setMessageText(messageContent); // Put the message back if error
      return;
    }

    // ===== CREATE OPTIMISTIC MESSAGE =====
    // Show the message immediately while waiting for server
    const optimisticMessage = {
      id: tempId, // Temporary ID
      chat_id: chat_id,
      sender_id: userId,
      content: messageContent,
      image_url: null,
      created_at: new Date().toISOString(), // Current time
      __typename: "Message",
    };

    // ===== ADD OPTIMISTIC MESSAGE TO LIST =====
    // Technician sees their message right away
    setOptimisticMessages((prev) => new Map(prev).set(tempId, optimisticMessage));

    try {
      // ===== SEND MESSAGE TO SERVER =====
      const result = await sendMessage({
        variables: {
          chat_id: String(chat_id), // Make sure it's text, not number
          sender_id: String(userId), // Make sure it's text, not number
          content: messageContent,
          image_url: null, // No images yet
        },
        
        // ===== UPDATE LOCAL CACHE WHEN SERVER RESPONDS =====
        update: (cache, { data: mutationData }) => {
          // Check if server actually sent back data
          if (!mutationData?.sendMessage) {
            console.warn("No sendMessage data in response - skipping cache update");
            return;
          }

          const messageData = mutationData.sendMessage;

          // ===== VALIDATE SERVER RESPONSE =====
          // Make sure server sent back all required fields
          if (!messageData.id || !messageData.chat_id || !messageData.sender_id) {
            console.error("Incomplete message data from server:", {
              id: messageData.id,
              chat_id: messageData.chat_id,
              sender_id: messageData.sender_id,
              content: messageData.content,
            });
            console.warn("Skipping cache update due to incomplete data");
            return;
          }

          try {
            // ===== REMOVE OPTIMISTIC MESSAGE =====
            // We have the real message now, so remove the temporary one
            setOptimisticMessages((prev) => {
              const updated = new Map(prev);
              updated.delete(tempId);
              return updated;
            });

            // ===== GET CURRENT MESSAGES FROM CACHE =====
            const existingData = cache.readQuery({
              query: GET_MESSAGES_BY_CHAT,
              variables: { chat_id: chat_id },
            });

            if (existingData) {
              const existingMessages = existingData.getMessagesByChat || [];

              // ===== PREPARE THE NEW MESSAGE =====
              // Make sure it has all the right fields
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

              // ===== CHECK FOR DUPLICATES =====
              // Don't add the same message twice
              const messageExists = existingMessages.some((msg) => msg.id === newMessage.id);

              if (!messageExists) {
                // ===== ADD NEW MESSAGE TO CACHE =====
                const updatedMessages = [...existingMessages, newMessage];

                cache.writeQuery({
                  query: GET_MESSAGES_BY_CHAT,
                  variables: { chat_id: chat_id },
                  data: {
                    getMessagesByChat: updatedMessages,
                  },
                });
              }
            }
          } catch (cacheError) {
            // ===== HANDLE CACHE ERRORS =====
            // Log the error but don't crash the app
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
      // ===== HANDLE SENDING ERRORS =====
      console.error("Failed to send message:", error);

      // ===== CLEAN UP ON ERROR =====
      // Remove the optimistic message since sending failed
      setOptimisticMessages((prev) => {
        const updated = new Map(prev);
        updated.delete(tempId);
        return updated;
      });

      // ===== PUT MESSAGE BACK IN INPUT =====
      // Let technician try again
      setMessageText(messageContent);
    }
  };

  // ===== COMBINE ALL MESSAGES FOR DISPLAY =====
  // Mix real messages from server with optimistic messages
  const allMessages = React.useMemo(() => {
    const realMessages = data?.getMessagesByChat || []; // Messages from server
    const optimisticArray = Array.from(optimisticMessages.values()); // Optimistic messages

    // ===== MERGE AND SORT MESSAGES =====
    // Put them in order by time (oldest first)
    const combined = [...realMessages, ...optimisticArray];
    return combined.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }, [data?.getMessagesByChat, optimisticMessages]);

  // ===== AUTO-SCROLL TO BOTTOM =====
  // When new messages arrive, automatically scroll down
  useEffect(() => {
    if (allMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [allMessages.length]);

  // ===== LOADING STATE =====
  // Show loading message while fetching data
  if (loading && !data) {
    return (
      <SafeAreaView style={ChatScreenStyles.container}>
        <Text style={ChatScreenStyles.loadingText}>Loading chat...</Text>
      </SafeAreaView>
    );
  }

  // ===== ERROR STATE =====
  // Show error message if something went wrong
  if (error && !data) {
    return (
      <SafeAreaView style={ChatScreenStyles.container}>
        <View style={ChatScreenStyles.errorContainer}>
          <Text style={ChatScreenStyles.errorText}>Error loading messages</Text>
          <Text style={ChatScreenStyles.errorText}>{error.message}</Text>
          <TouchableOpacity onPress={() => refetch()} style={ChatScreenStyles.retryButton}>
            <Text style={ChatScreenStyles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ===== MAIN CHAT INTERFACE =====
  return (
    <SafeAreaView style={ChatScreenStyles.container}>
      {/* ===== CHAT HEADER ===== */}
      {/* Shows customer info and what design is being discussed */}
      <ChatHeader
        onBack={() => navigation.goBack()} // Go back when technician taps back button
        otherUser={otherUser} // Customer they're chatting with
        design={designInfo} // Nail design being discussed
        currentUserRole={currentUserRole} // This is 'technician'
      />

      {/* ===== MESSAGES LIST ===== */}
      {/* Scrollable list of all chat messages */}
      <FlatList
        ref={flatListRef} // So we can scroll programmatically
        data={allMessages} // All messages (real + optimistic)
        keyExtractor={(item) => item.id} // Unique ID for each message
        
        // Render each message
        renderItem={({ item }) => {
          const isSent = item.sender_id === userId; // Did current technician send this?
          const isOptimistic = item.id.startsWith("temp-"); // Is this a temporary message?

          return (
            <View
              style={[
                ChatScreenStyles.messageBubble, // Base message style
                isSent ? ChatScreenStyles.sent : ChatScreenStyles.received, // Different colors for sent/received
                isOptimistic && ChatScreenStyles.optimistic, // Slightly faded if optimistic
              ]}
            >
              {/* ===== MESSAGE TEXT ===== */}
              <Text
                style={[
                  ChatScreenStyles.messageText,
                  isSent && ChatScreenStyles.sentMessageText, // White text for sent messages
                ]}
              >
                {item.content}
              </Text>
              
              {/* ===== MESSAGE TIME ===== */}
              <Text
                style={[
                  ChatScreenStyles.timeText,
                  isSent && ChatScreenStyles.sentTimeText, // Different color for sent message times
                ]}
              >
                {/* Format time as HH:MM */}
                {new Date(item.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {/* Show hourglass if message is still sending */}
                {isOptimistic && " ⏳"}
              </Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false} // Hide scroll bar
        contentContainerStyle={{ paddingBottom: 10 }} // Extra space at bottom
      />

      {/* ===== MESSAGE INPUT AREA ===== */}
      <View style={ChatScreenStyles.inputContainer}>
        {/* ===== TEXT INPUT BOX ===== */}
        <TextInput
          value={messageText} // What technician has typed
          onChangeText={setMessageText} // Update when technician types
          placeholder="Type a message..." // Hint text
          style={ChatScreenStyles.input}
          multiline // Allow multiple lines
          maxLength={1000} // Don't let messages get too long
          returnKeyType="send" // Show "Send" on keyboard
          onSubmitEditing={handleSend} // Send when technician presses Enter
          blurOnSubmit={false} // Keep keyboard open after sending
        />
        
        {/* ===== SEND BUTTON ===== */}
        <TouchableOpacity
          onPress={handleSend} // Send message when tapped
          style={[
            ChatScreenStyles.sendButton,
            // Disable button if sending or no text
            (sendingMessage || !messageText.trim()) && ChatScreenStyles.sendButtonDisabled,
          ]}
          disabled={sendingMessage || !messageText.trim()} // Can't tap if disabled
        >
          <Text style={ChatScreenStyles.sendButtonText}>
            {sendingMessage ? "Sending..." : "Send"} {/* Show "Sending..." while sending */}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TechnicianChatScreen;
