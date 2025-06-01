// Form validation

export const validateDesignForm = (mainImage, title, description) => {
    if (!mainImage) {
      return { isValid: false, error: "Please upload a main image." };
    }
  
    if (!title || title.length > 50) {
      return { 
        isValid: false, 
        error: "Title is required and must be under 50 characters." 
      };
    }
  
    if (description.length > 300) {
      return { 
        isValid: false, 
        error: "Description must be under 300 characters." 
      };
    }
  
    return { isValid: true };
  };