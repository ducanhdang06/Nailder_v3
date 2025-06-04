import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { authStyles } from '../../styles/authStyles';

const ChatHeader = ({ 
  onBack, 
  otherUser, 
  design, 
  currentUserRole 
}) => {
  return (
    <View style={styles.header}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Chat Info */}
      <View style={styles.chatInfo}>
        {/* Other User Info */}
        <Text style={styles.userName}>{otherUser?.fullName || 'Unknown User'}</Text>
        <Text style={styles.userRole}>
          {currentUserRole === 'customer' ? 'Nail Technician' : 'Customer'}
        </Text>
        
        {/* Design Info (if chat is about a specific design) */}
        {design && (
          <View style={styles.designInfo}>
            <Image 
              source={{ uri: design.imageUrl }} 
              style={styles.designImage}
              resizeMode="cover"
            />
            <View style={styles.designDetails}>
              <Text style={styles.designTitle} numberOfLines={1}>
                💅 {design.title}
              </Text>
              <Text style={styles.designDesigner} numberOfLines={1}>
                by {design.designerName}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 20,
    color: '#fb7185',
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  designInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf2f8',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#fce7f3',
  },
  designImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 8,
  },
  designDetails: {
    flex: 1,
  },
  designTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  designDesigner: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default ChatHeader; 