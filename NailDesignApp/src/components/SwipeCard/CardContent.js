// Purpose: Pure presentational component for individual cards

// Displays the card image, title, designer info
// Renders designer avatar with initials
// Shows like count with heart icon
// Handles tag display with overflow ("+2 more")

// Why separate:

// Pure component = easy to test
// Can be reused in other contexts (card grids, lists)
// Isolates all the card layout logic

import React from "react";
import { View, Text, Image } from "react-native";
import { swipeCardStyles } from "../../styles/swipeCardStyles";
import { getDesignerInitials, parseTagsArray, getVisibleTags } from "../../utils/swipeHelpers";

const TagsList = ({ tagsString }) => {
  const tagsArray = parseTagsArray(tagsString);
  if (tagsArray.length === 0) return null;

  const { visibleTags, remainingCount } = getVisibleTags(tagsArray, 3);
  
  return (
    <View style={swipeCardStyles.tagsContainer}>
      {visibleTags.map((tag, index) => (
        <View key={`${tag}-${index}`} style={swipeCardStyles.tag}>
          <Text style={swipeCardStyles.tagText}>{tag}</Text>
        </View>
      ))}
      {remainingCount > 0 && (
        <View style={[swipeCardStyles.tag, swipeCardStyles.moreTag]}>
          <Text style={swipeCardStyles.tagText}>+{remainingCount}</Text>
        </View>
      )}
    </View>
  );
};

const CardContent = ({ design }) => (
  <View style={swipeCardStyles.card}>
    <Image
      source={{ uri: design.imageUrl }}
      style={swipeCardStyles.cardImage}
      resizeMode="cover"
    />
    
    <View style={swipeCardStyles.cardInfo}>
      <Text style={swipeCardStyles.cardTitle} numberOfLines={2}>
        {design.title || 'Untitled Design'}
      </Text>
      
      <View style={swipeCardStyles.designerRow}>
        <View style={swipeCardStyles.designerAvatar}>
          <Text style={swipeCardStyles.avatarText}>
            {getDesignerInitials(design.designerName)}
          </Text>
        </View>
        <Text style={swipeCardStyles.designerName} numberOfLines={1}>
          {design.designerName || 'Unknown Designer'}
        </Text>
        
        <View style={swipeCardStyles.likesContainer}>
          <Text style={swipeCardStyles.heartIcon}>❤️</Text>
          <Text style={swipeCardStyles.likesCount}>{design.likes || 0}</Text>
        </View>
      </View>
      
      <TagsList tagsString={design.tags} />
    </View>
  </View>
);

export default CardContent;