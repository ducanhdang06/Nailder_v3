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
 * TechnicianResultCard component for displaying technician search results
 * @param {Object} props - Component props
 * @param {Object} props.technician - Technician data
 * @param {Function} props.onPress - Press handler
 * @returns {JSX.Element}
 */
const TechnicianResultCard = ({ technician, onPress }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐'); // You might want to use a half-star icon here
    }
    
    return stars.join('');
  };

  return (
    <TouchableOpacity
      style={searchStyles.technicianResultCard}
      onPress={() => onPress(technician)}
    >
      <Image 
        source={{ uri: technician.profileImage }} 
        style={searchStyles.technicianImage}
        resizeMode="cover"
      />
      
      <View style={searchStyles.technicianContent}>
        <View style={searchStyles.technicianHeader}>
          <Text style={searchStyles.technicianName} numberOfLines={1}>
            {technician.name}
          </Text>
          <View style={searchStyles.ratingContainer}>
            <Text style={searchStyles.ratingStars}>
              {renderStars(technician.rating)}
            </Text>
            <Text style={searchStyles.ratingText}>
              {technician.rating} ({technician.reviewCount})
            </Text>
          </View>
        </View>
        
        <Text style={searchStyles.technicianLocation} numberOfLines={1}>
          📍 {technician.location} • {technician.distance}
        </Text>
        
        {technician.bio && (
          <Text style={searchStyles.technicianBio} numberOfLines={2}>
            {technician.bio}
          </Text>
        )}
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={searchStyles.specialtiesContainer}
        >
          {technician.specialties.map((specialty, index) => (
            <View key={index} style={searchStyles.specialtyChip}>
              <Text style={searchStyles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
};

export default TechnicianResultCard;