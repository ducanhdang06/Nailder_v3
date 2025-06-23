/**
 * Creates user info object for chat display
 * @param {string} id - User ID
 * @param {string} name - User name
 * @param {string} currentUserRole - Current user's role
 * @returns {Object} User info object
 */
export const createOtherUserInfo = (id, name, currentUserRole) => {
    const defaultName = currentUserRole.toLowerCase === "customer" ? "Nail Technician" : "Customer";
    const defaultEmail = currentUserRole.toLowerCase === "customer" ? "contact@nailstudio.com" : "customer@nailapp.com";
    
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