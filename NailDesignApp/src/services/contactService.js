import client from "../graphql/apolloClient"; // adjust path to your Apollo client
import { START_CHAT } from "../graphql/mutations"; // adjust path to your mutation
import { fetchAuthSession } from "aws-amplify/auth";

export const contactService = {
  async contactDesigner(design, navigation) {
    try {
      console.log("=== CONTACT SERVICE DEBUG ===");
      console.log("Design object received:", JSON.stringify(design, null, 2));
      console.log("design.designerId:", design.designerId);
      console.log("design.technicianId:", design.technicianId);
      console.log("design.tech_id:", design.tech_id);
      console.log("design.designerName:", design.designerName);
      console.log("==============================");

      // Get current user ID from auth session
      const session = await fetchAuthSession();
      const customerId = session.tokens?.idToken?.payload?.sub;
      
      if (!customerId) {
        throw new Error("User not authenticated");
      }

      // Use tech_id since that's what your design objects have
      const technicianId = design.tech_id || design.designerId || design.technicianId;
      
      if (!technicianId) {
        throw new Error("No technician ID found in design object");
      }

      console.log("Using technician ID:", technicianId);
      console.log("Customer ID:", customerId);

      const { data } = await client.mutate({
        mutation: START_CHAT,
        variables: {
          customer_id: customerId,
          technician_id: technicianId,
          design_id: design.id,
        },
      });
      
      const chat = data?.startChat;
      if (chat?.id) {
        console.log("Chat created with ID:", chat.id);
        console.log("Navigating to ChatScreen with design data...");
        
        navigation.navigate("ChatScreen", {
          chat_id: chat.id,
          technician_id: technicianId,
          // Pass design information for the chat header
          design: {
            id: design.id,
            title: design.title,
            imageUrl: design.imageUrl,
            designerName: design.designerName
          },
          otherUserName: design.designerName,
          designTitle: design.title
        });
      } else {
        throw new Error("Failed to create chat - no chat ID returned");
      }
    } catch (error) {
      console.error("❌ Failed to start chat:", error);
      throw error; // Re-throw so the calling function can handle it
    }
  },
};