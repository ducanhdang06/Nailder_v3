import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getRankingIndicator } from '../../utils/searchUtils';
import { searchStyles } from '../../styles/searchStyles';

/**
 * TopDesignCard component for displaying top liked designs
 * @param {Object} props - Component props
 * @param {Object} props.item - Design item data
 * @param {number} props.index - Index in the list (for ranking)
 * @param {Function} props.onPress - Press handler
 * @returns {JSX.Element}
 */
const TopDesignCard = ({ item, index, onPress }) => {
  const ranking = getRankingIndicator(index);

  return (
    <TouchableOpacity
      style={searchStyles.topDesignCard}
      onPress={() => onPress(item)}
    >
      <View style={searchStyles.designImageContainer}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={searchStyles.designImage} 
        />
        
        {/* Ranking Badge - Top Left */}
        {ranking && (
          <View style={[searchStyles.rankingBadge, { backgroundColor: ranking.color }]}>
            <Text style={searchStyles.rankingIcon}>{ranking.icon}</Text>
            <Text style={searchStyles.rankingText}>{ranking.label}</Text>
          </View>
        )}
        
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={searchStyles.designImageOverlay}
        >
          <View style={searchStyles.designLikes}>
            <Text style={searchStyles.likesIcon}>❤️</Text>
            <Text style={searchStyles.likesCount}>{item.likes}</Text>
          </View>
        </LinearGradient>
      </View>
      
      <View style={searchStyles.designInfo}>
        <Text style={searchStyles.designTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={searchStyles.designCreator} numberOfLines={1}>
          by {item.designerName}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={searchStyles.tagsContainer}
        >
          {item.tags.split(",").map((tag, tagIndex) => (
            <View key={tagIndex} style={searchStyles.tagChip}>
              <Text style={searchStyles.tagText}>{tag}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
};

export default TopDesignCard;