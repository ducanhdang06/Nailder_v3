import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { detailsStyles } from '../../styles/detailsStyles';

const ActionButtons = ({ onUnsave, onContact }) => {
  return (
    <View style={detailsStyles.bottomActions}>
      <TouchableOpacity 
        style={[detailsStyles.actionButton, detailsStyles.unsaveButton]}
        onPress={onUnsave}
      >
        <Text style={detailsStyles.unsaveButtonText}>💔 Unsave</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[detailsStyles.actionButton, detailsStyles.contactButton]}
        onPress={onContact}
      >
        <Text style={detailsStyles.contactButtonText}>💬 Contact Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionButtons;