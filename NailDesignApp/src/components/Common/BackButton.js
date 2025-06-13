import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BackButton = ({ onBack, containerStyle }) => {
  return (
    <View style={[styles.header, containerStyle]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 20,
    color: '#fb7185',
    fontWeight: 'bold',
  },
});

export default BackButton; 