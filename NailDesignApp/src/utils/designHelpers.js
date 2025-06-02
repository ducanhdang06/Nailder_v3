/**
 * Parse tags from string or array format
 * @param {string|array} tags - Tags in string or array format
 * @returns {array} Array of cleaned tag strings
 */
export const parseTags = (tags) => {
    if (!tags) return [];
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    return tags;
  };
  
  /**
   * Get all images including main and extra images
   * @param {object} design - Design object with imageUrl and extraImages
   * @returns {array} Array of image URLs
   */
  export const getAllImages = (design) => {
    const images = [design.imageUrl];
    if (design.extraImages && design.extraImages.length > 0) {
      images.push(...design.extraImages);
    }
    return images.filter(img => img); // Remove any null/undefined images
  };
  
  /**
   * Format creation date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  export const formatCreationDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  /**
   * Get designer display name with fallback
   * @param {string} designerName - Designer name
   * @returns {string} Display name or fallback
   */
  export const getDesignerDisplayName = (designerName) => {
    return designerName || 'Unknown Designer';
  };
  
  /**
   * Get design title with fallback
   * @param {string} title - Design title
   * @returns {string} Display title or fallback
   */
  export const getDesignTitle = (title) => {
    return title || 'Untitled Design';
  };