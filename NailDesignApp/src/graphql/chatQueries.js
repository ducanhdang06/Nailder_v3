import { gql } from '@apollo/client';

// =============================================
// CHAT QUERIES
// =============================================

export const GET_MESSAGES_BY_CHAT = gql`
  query GetMessagesByChat($chat_id: ID!) {
    getMessagesByChat(chat_id: $chat_id) {
      id
      chat_id
      sender_id
      content
      image_url
      created_at
    }
  }
`;

export const GET_CHAT_INFO = gql`
  query GetChatInfo($chat_id: ID!) {
    getChatInfo(chat_id: $chat_id) {
      id
      customer_id
      technician_id
      design_id
      created_at
      customer {
        id
        fullName
        email
      }
      technician {
        id
        fullName
        email
      }
      design {
        id
        title
        imageUrl
        designerName
      }
    }
  }
`;

export const GET_CHAT_INFO_SIMPLE = gql`
  query GetChatInfoSimple($chat_id: ID!) {
    getChatInfo(chat_id: $chat_id) {
      id
      customer_id
      technician_id
      design_id
      created_at
    }
  }
`;

export const GET_USER_CHATS = gql`
  query GetUserChats($user_id: ID!) {
    getUserChats(user_id: $user_id) {
      id
      customer_id
      technician_id
      design_id
      created_at
      lastMessage {
        content
        created_at
        sender_id
      }
      customer {
        id
        fullName
      }
      technician {
        id
        fullName
      }
      design {
        id
        title
        imageUrl
      }
    }
  }
`;

// =============================================
// CHAT SUBSCRIPTIONS
// =============================================

export const ON_NEW_MESSAGE = gql`
  subscription OnNewMessage($chat_id: ID!) {
    onNewMessage(chat_id: $chat_id) {
      id
      chat_id
      sender_id
      content
      image_url
      created_at
    }
  }
`;
