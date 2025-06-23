/**
 * Creates user info object for chat display
 * @param {string} id - User ID
 * @param {string} name - User name
 * @param {string} currentUserRole - Current user's role
 * @returns {Object} User info object
 */
export const createOtherUserInfo = (id, name, currentUserRole) => {
  const defaultName =
    currentUserRole.toLowerCase === "customer" ? "Nail Technician" : "Customer";
  const defaultEmail =
    currentUserRole.toLowerCase === "customer"
      ? "contact@nailstudio.com"
      : "customer@nailapp.com";

  return {
    id,
    fullName: name || defaultName,
    email: defaultEmail,
  };
};

/**
 * Creates design info object for chat display
 * @param {Object} design - Design object
 * @param {string} designTitle - Fallback title
 * @returns {Object|null} Design info object or null
 */
export const createDesignInfo = (design, designTitle) => {
  if (!design) return null;

  return {
    id: design.id,
    title: design.title || designTitle,
    imageUrl: design.imageUrl,
    designerName: design.designerName,
  };
};

/**
 * Validates required chat parameters
 * @param {string} chatId - Chat ID
 * @param {string} userId - User ID
 * @returns {boolean} Whether parameters are valid
 */
export const validateChatParams = (chatId, userId) => {
  return !!(chatId && userId);
};

/**
 * Gets user role from user object
 * @param {Object} user - User object
 * @returns {string} User role
 */
export const getUserRole = (user) => {
  return user?.role || user?.["custom:userType"];
};


export const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return "now";
  } else if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffInHours < 168) {
    // Less than a week
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
};

export const getChatParticipants = (
  chat,
  currentUserId,
  userType = "customer"
) => {
  if (userType.toLowerCase === "customer") {
    const isCustomer = chat.customer_id === currentUserId;
    const otherUser = isCustomer ? chat.technician : chat.customer;
    const otherUserId = isCustomer ? chat.technician_id : chat.customer_id;
    return { isCurrentUserCustomer: isCustomer, otherUser, otherUserId };
  } else {
    const isTechnician = chat.technician_id === currentUserId;
    const otherUser = isTechnician ? chat.customer : chat.technician;
    const otherUserId = isTechnician ? chat.customer_id : chat.technician_id;
    return { isCurrentUserTechnician: isTechnician, otherUser, otherUserId };
  }
};

export const buildChatNavigationParams = (
  chat,
  otherUser,
  userType = "customer"
) => {
  const baseParams = {
    chat_id: chat.id,
    design: chat.design
      ? {
          id: chat.design.id,
          title: chat.design.title,
          imageUrl: chat.design.imageUrl,
          designerName: otherUser?.fullName,
        }
      : null,
    otherUserName:
      otherUser?.fullName || (userType.toLowerCase === "customer" ? "User" : "Customer"),
    designTitle: chat.design?.title,
  };

  if (userType.toLowerCase === "customer") {
    return {
      ...baseParams,
      technician_id: chat.technician_id,
    };
  } else {
    return {
      ...baseParams,
      customer_id: chat.customer_id,
    };
  }
};
