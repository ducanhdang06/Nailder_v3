import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { searchStyles } from '../../styles/searchStyles';

/**
 * DesignResultCard component for displaying design search results
 * @param {Object} props - Component props
 * @param {Object} props.design - Design data
 * @param {Function} props.onPress - Press handler
 * @returns {JSX.Element}
 */
const DesignResultCard = ({ design, onPress }) => {
  return (
    <TouchableOpacity
      style={searchStyles.designResultCard}
      onPress={() => onPress(design)}
    >
      <Image 
        source={{ uri: design.imageUrl }} 
        style={searchStyles.resultImage}
        resizeMode="cover"
      />
      
      <View style={searchStyles.resultContent}>
        <View style={searchStyles.resultHeader}>
          <Text style={searchStyles.resultTitle} numberOfLines={1}>
            {design.title}
          </Text>
          <View style={searchStyles.resultLikes}>
            <Text style={searchStyles.likesIcon}>❤️</Text>
            <Text style={searchStyles.likesText}>{design.likes}</Text>
          </View>
        </View>
        
        <Text style={searchStyles.resultCreator} numberOfLines={1}>
          by {design.designerName}
        </Text>
        
        {design.description && (
          <Text style={searchStyles.resultDescription} numberOfLines={2}>
            {design.description}
          </Text>
        )}
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={searchStyles.resultTagsContainer}
        >
          {design.tags.split(",").map((tag, index) => (
            <View key={index} style={searchStyles.resultTagChip}>
              <Text style={searchStyles.resultTagText}>{tag.trim()}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
};

export default DesignResultCard;