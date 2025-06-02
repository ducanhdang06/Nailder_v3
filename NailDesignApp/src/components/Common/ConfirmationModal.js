import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { confirmationModalStyles } from '../../styles/confirmationModalStyles';

const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmStyle = "destructive", // "destructive" or "primary"
}) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, scaleValue]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const isDestructive = confirmStyle === "destructive";

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View style={confirmationModalStyles.overlay}>
        <TouchableOpacity 
          style={confirmationModalStyles.overlayTouch}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            confirmationModalStyles.modalContainer,
            {
              transform: [{ scale: scaleValue }]
            }
          ]}
        >
          <View style={confirmationModalStyles.modalContent}>
            {/* Title */}
            <Text style={confirmationModalStyles.title}>{title}</Text>
            
            {/* Message */}
            <Text style={confirmationModalStyles.message}>{message}</Text>
            
            {/* Buttons */}
            <View style={confirmationModalStyles.buttonContainer}>
              {/* Cancel Button */}
              <TouchableOpacity
                style={[confirmationModalStyles.button, confirmationModalStyles.cancelButton]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={confirmationModalStyles.cancelButtonText}>
                  {cancelText}
                </Text>
              </TouchableOpacity>
              
              {/* Confirm Button */}
              <TouchableOpacity
                style={[confirmationModalStyles.button, confirmationModalStyles.confirmButton]}
                onPress={handleConfirm}
                activeOpacity={0.7}
              >
                {isDestructive ? (
                  <View style={confirmationModalStyles.destructiveButton}>
                    <Text style={confirmationModalStyles.destructiveButtonText}>
                      {confirmText}
                    </Text>
                  </View>
                ) : (
                  <LinearGradient
                    colors={["#fb7185", "#ec4899"]}
                    style={confirmationModalStyles.confirmButtonGradient}
                  >
                    <Text style={confirmationModalStyles.confirmButtonText}>
                      {confirmText}
                    </Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal; 