import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatTime } from "../../utils/chatUtils";
import { chatStyles } from "../../styles/chatStyles";

const ChatCard = ({ 
  chat, 
  index, 
  onPress, 
  otherUser, 
  currentUserId, 
  userType = 'customer' 
}) => {
  const lastMessage = chat.lastMessage;
  const hasUnread = false; // TODO: Implement unread logic
  
  return (
    <TouchableOpacity 
      style={[chatStyles.chatCard, { marginTop: index === 0 ? 16 : 8 }]}
      onPress={() => onPress(chat)}
      activeOpacity={0.7}
    >
      <View style={chatStyles.cardContent}>
        {/* Design Image with Gradient Overlay */}
        <View style={chatStyles.imageContainer}>
          {chat.design?.imageUrl ? (
            <>
              <Image 
                source={{ uri: chat.design.imageUrl }} 
                style={chatStyles.designImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)']}
                style={chatStyles.imageOverlay}
              />
            </>
          ) : (
            <View style={chatStyles.placeholderImage}>
              <Text style={chatStyles.placeholderText}>💅</Text>
            </View>
          )}
          {hasUnread && <View style={chatStyles.unreadDot} />}
        </View>
        
        {/* Chat Info */}
        <View style={chatStyles.chatInfo}>
          <View style={chatStyles.chatHeader}>
            <Text style={chatStyles.userName} numberOfLines={1}>
              {otherUser?.fullName || (userType.toLowerCase === 'customer' ? "User" : "Customer")}
            </Text>
            <View style={chatStyles.timeContainer}>
              <Text style={chatStyles.timeText}>
                {formatTime(lastMessage?.created_at || chat.created_at)}
              </Text>
            </View>
          </View>
          
          <Text style={chatStyles.designTitle} numberOfLines={1}>
            💅 {chat.design?.title || "Design Discussion"}
          </Text>
          
          {lastMessage ? (
            <Text style={chatStyles.lastMessage} numberOfLines={2}>
              {lastMessage.sender_id === currentUserId ? (
                <Text style={chatStyles.youText}>You: </Text>
              ) : null}
              {lastMessage.content}
            </Text>
          ) : (
            <Text style={chatStyles.noMessages}>Start the conversation...</Text>
          )}
        </View>
      </View>
      
      {/* Chat Status Indicator */}
      <View style={chatStyles.statusContainer}>
        <View style={[chatStyles.statusDot, { backgroundColor: hasUnread ? '#fb7185' : '#e5e7eb' }]} />
      </View>
    </TouchableOpacity>
  );
};

export default ChatCard;