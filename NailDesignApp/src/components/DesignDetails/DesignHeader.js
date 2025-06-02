import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { detailsStyles } from '../../styles/detailsStyles';

const DesignHeader = ({ onBack }) => {
  return (
    <View style={detailsStyles.header}>
      <TouchableOpacity 
        style={detailsStyles.backButton}
        onPress={onBack}
      >
        <Text style={detailsStyles.backIcon}>←</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DesignHeader;