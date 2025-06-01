export const getDesignerInitials = (fullName) => {
    if (!fullName) return '??';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  export const parseTagsArray = (tagsString) => {
    if (!tagsString || tagsString.trim() === '') return [];
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };
  
  export const getVisibleTags = (tagsArray, maxVisible = 3) => {
    const visibleTags = tagsArray.slice(0, maxVisible);
    const remainingCount = tagsArray.length - visibleTags.length;
    return { visibleTags, remainingCount };
  };
  