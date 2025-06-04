import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { useQuery, useMutation, useSubscription, useApolloClient } from "@apollo/client";
import { useUser } from "../../context/userContext";
import ChatHeader from "../../components/Chat/ChatHeader";
import {
  GET_MESSAGES_BY_CHAT,
  GET_CHAT_INFO,
  ON_NEW_MESSAGE,
} from "../../graphql/chatQueries";
import { SEND_MESSAGE } from "../../graphql/mutations";

const ChatScreen = ({ route, navigation }) => {
  const { chat_id, technician_id, design, otherUserName, designTitle } = route.params;
  const { user } = useUser();
  const userId = user?.sub;
  const currentUserRole = user?.role || user?.["custom:userType"];
  const client = useApolloClient();
  
  console.log("=== CHAT SCREEN INITIALIZATION ===");
  console.log("Route params:", JSON.stringify(route.params, null, 2));
  console.log("Chat ID:", chat_id, "(type:", typeof chat_id, ")");
  console.log("Technician ID:", technician_id, "(type:", typeof technician_id, ")");
  console.log("User context:", { 
    userId, 
    userIdType: typeof userId, 
    role: currentUserRole, 
    fullUser: user ? Object.keys(user) : 'null'
  });
  
  const [messageText, setMessageText] = useState("");
  const flatListRef = useRef();
  
  // Track optimistic messages to prevent flickering
  const [optimisticMessages, setOptimisticMessages] = useState(new Map());

  // Early return if no user
  if (!user || !userId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User not authenticated</Text>
      </View>
    );
  }

  // Fetch messages with optimized polling
  const { data, loading, error, refetch } = useQuery(GET_MESSAGES_BY_CHAT, {
    variables: { chat_id: chat_id },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    pollInterval: 3000, // Reduced polling for better performance
    onCompleted: (queryData) => {
      console.log("=== QUERY COMPLETED ===");
      console.log("Messages fetched:", queryData?.getMessagesByChat?.length || 0);
      
      // Clean up optimistic messages that now exist in real data
      const realMessageIds = new Set(
        queryData?.getMessagesByChat?.map(msg => msg.id) || []
      );
      
      setOptimisticMessages(prev => {
        const cleaned = new Map();
        for (const [id, msg] of prev) {
          if (!realMessageIds.has(id) && id.startsWith('temp-')) {
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
    fullName: otherUserName || (currentUserRole === 'customer' ? 'Nail Technician' : 'Customer'),
    email: 'contact@nailstudio.com'
  };

  const designInfo = design ? {
    id: design.id,
    title: design.title || designTitle,
    imageUrl: design.imageUrl,
    designerName: design.designerName
  } : null;

  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    errorPolicy: 'all',
    onError: (error) => {
      console.error('=== SEND MESSAGE ERROR ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('GraphQL errors:', error.graphQLErrors);
      console.error('Network error:', error.networkError);
      console.error('Error extraInfo:', error.extraInfo);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    },
    onCompleted: (data) => {
      console.log('=== SEND MESSAGE SUCCESS ===');
      console.log('Full response data:', JSON.stringify(data, null, 2));
      console.log('sendMessage result:', data?.sendMessage);
      
      if (!data?.sendMessage) {
        console.warn("⚠️ No sendMessage data in response - this might indicate a backend issue");
      }
    }
  });

  const handleSend = async () => {
    if (!messageText.trim() || sendingMessage) return;

    const messageContent = messageText.trim();
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    setMessageText(""); // Clear input immediately for better UX

    // Validate required fields before sending
    if (!chat_id || !userId) {
      console.error("❌ Missing required fields:", { chat_id, userId });
      Alert.alert('Error', 'Missing required information. Please try again.');
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
      __typename: 'Message'
    };

    // Add to optimistic messages immediately
    setOptimisticMessages(prev => new Map(prev).set(tempId, optimisticMessage));

    console.log("=== SENDING MESSAGE ===");
    console.log("chat_id:", chat_id, "(type:", typeof chat_id, ")");
    console.log("sender_id (userId):", userId, "(type:", typeof userId, ")");
    console.log("content:", messageContent);
    console.log("image_url:", null);

    try {
      const result = await sendMessage({
        variables: {
          chat_id: String(chat_id), // Ensure it's a string
          sender_id: String(userId), // Ensure it's a string
          content: messageContent,
          image_url: null,
        },
        update: (cache, { data: mutationData }) => {
          console.log("=== CACHE UPDATE ===");
          console.log("Mutation data:", JSON.stringify(mutationData, null, 2));
          
          if (!mutationData?.sendMessage) {
            console.warn("❌ No sendMessage data in response - skipping cache update");
            return;
          }

          const messageData = mutationData.sendMessage;
          
          // Validate that all required fields are present
          if (!messageData.id || !messageData.chat_id || !messageData.sender_id) {
            console.error("❌ Incomplete message data from server:", {
              id: messageData.id,
              chat_id: messageData.chat_id,
              sender_id: messageData.sender_id,
              content: messageData.content
            });
            console.warn("Skipping cache update due to incomplete data");
            return;
          }

          try {
            // Remove optimistic message since we have real response
            setOptimisticMessages(prev => {
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
                __typename: 'Message',
                id: messageData.id,
                chat_id: messageData.chat_id,
                sender_id: messageData.sender_id,
                content: messageData.content,
                image_url: messageData.image_url,
                created_at: messageData.created_at,
              };
              
              console.log("Normalized message for cache:", newMessage);
              
              // Check for duplicates
              const messageExists = existingMessages.some(msg => msg.id === newMessage.id);
              
              if (!messageExists) {
                const updatedMessages = [...existingMessages, newMessage];
                
                cache.writeQuery({
                  query: GET_MESSAGES_BY_CHAT,
                  variables: { chat_id: chat_id },
                  data: {
                    getMessagesByChat: updatedMessages,
                  },
                });
                
                console.log("✅ Message added to cache successfully");
              } else {
                console.log("ℹ️ Message already exists in cache, skipping");
              }
            }
          } catch (cacheError) {
            console.error('Cache update failed:', cacheError);
            console.error('Cache error details:', {
              error: cacheError.message,
              mutationData: messageData,
              chatId: chat_id
            });
            
            // Don't throw - let polling handle the sync
            console.log("⏳ Relying on polling to sync message");
          }
        },
      });
      
      console.log("✅ Message sent successfully");
      
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      
      // Clean up optimistic message on error
      setOptimisticMessages(prev => {
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

  // Loading state
  if (loading && !data) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading chat...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading messages</Text>
          <Text style={styles.errorText}>{error.message}</Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  console.log("=== RENDER DEBUG ===");
  console.log("Real messages:", data?.getMessagesByChat?.length || 0);
  console.log("Optimistic messages:", optimisticMessages.size);
  console.log("Total messages:", allMessages.length);

  return (
    <SafeAreaView style={styles.container}>
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
          const isOptimistic = item.id.startsWith('temp-');
          
          return (
            <View
              style={[
                styles.messageBubble,
                isSent ? styles.sent : styles.received,
                isOptimistic && styles.optimistic
              ]}
            >
              <Text style={[
                styles.messageText,
                isSent && styles.sentMessageText
              ]}>
                {item.content}
              </Text>
              <Text style={[
                styles.timeText,
                isSent && styles.sentTimeText
              ]}>
                {new Date(item.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
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
      <View style={styles.inputContainer}>
        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          style={styles.input}
          multiline
          maxLength={1000}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <TouchableOpacity 
          onPress={handleSend} 
          style={[
            styles.sendButton,
            (sendingMessage || !messageText.trim()) && styles.sendButtonDisabled
          ]}
          disabled={sendingMessage || !messageText.trim()}
        >
          <Text style={styles.sendButtonText}>
            {sendingMessage ? "..." : "Send"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff"
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#fb7185',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  retryText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  messageBubble: {
    margin: 10,
    padding: 16,
    borderRadius: 16,
    maxWidth: "75%",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sent: {
    backgroundColor: "#fb7185",
    alignSelf: "flex-end",
  },
  received: {
    backgroundColor: "#f9fafb",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  optimistic: {
    opacity: 0.7,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    color: '#1f2937',
  },
  sentMessageText: {
    color: '#ffffff',
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  sentTimeText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: '#f9fafb',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: '#fff',
    maxHeight: 100,
    fontSize: 16,
    color: '#1f2937',
  },
  sendButton: {
    backgroundColor: "#fb7185",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: '500',
    fontSize: 16,
  },
});
