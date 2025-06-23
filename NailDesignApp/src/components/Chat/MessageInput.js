import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { ChatScreenStyles } from "../../styles/chatScreenStyles";

const MessageInput = ({
  messageText,
  setMessageText,
  onSend,
  sendingMessage,
}) => {
  return (
    <View style={ChatScreenStyles.inputContainer}>
      <TextInput
        value={messageText}
        onChangeText={setMessageText}
        placeholder="Type a message..."
        style={ChatScreenStyles.input}
        multiline
        maxLength={1000}
        returnKeyType="send"
        onSubmitEditing={onSend}
        blurOnSubmit={false}
      />
      
      <TouchableOpacity
        onPress={onSend}
        style={[
          ChatScreenStyles.sendButton,
          (sendingMessage || !messageText.trim()) && ChatScreenStyles.sendButtonDisabled,
        ]}
        disabled={sendingMessage || !messageText.trim()}
      >
        <Text style={ChatScreenStyles.sendButtonText}>
          {sendingMessage ? "Sending..." : "Send"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;