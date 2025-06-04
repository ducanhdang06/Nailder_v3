import { gql } from '@apollo/client';

// =============================================
// CHAT MUTATIONS
// =============================================

export const START_CHAT = gql`
  mutation StartChat($customer_id: ID!, $technician_id: ID!, $design_id: ID!) {
    startChat(customer_id: $customer_id, technician_id: $technician_id, design_id: $design_id) {
      id
      customer_id
      technician_id
      design_id
      created_at
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($chat_id: ID!, $sender_id: ID!, $content: String, $image_url: String) {
    sendMessage(chat_id: $chat_id, sender_id: $sender_id, content: $content, image_url: $image_url) {
      id
      chat_id
      sender_id
      content
      image_url
      created_at
    }
  }
`;
