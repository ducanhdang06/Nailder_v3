
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

const ConfirmSignUpScreen = ({ route, navigation }) => {
  const { email } = route.params || {};
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleConfirm = async () => {
    try {
      await confirmSignUp({ username: email, confirmationCode });
      Alert.alert('Success', 'Email confirmed. You can now log in.');
      navigation.navigate('Login');
    } catch (err) {
      console.error('Confirmation error:', err);
      Alert.alert('Error', err.message || 'Failed to confirm code');
    }
  };

  const handleResend = async () => {
    try {
      await resendSignUpCode({ username: email });
      Alert.alert('Code resent', 'A new confirmation code has been sent to your email.');
    } catch (err) {
      console.error('Resend error:', err);
      Alert.alert('Error', err.message || 'Failed to resend code');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Confirm Sign Up</Text>
      <Text style={{ marginTop: 10 }}>Confirmation code sent to: {email}</Text>
      <TextInput
        placeholder="Enter confirmation code"
        value={confirmationCode}
        onChangeText={setConfirmationCode}
        keyboardType="numeric"
        autoCapitalize="none"
        style={{ borderWidth: 1, marginTop: 20, padding: 10 }}
      />
      <Button title="Confirm" onPress={handleConfirm} />
      <Text style={{ marginVertical: 10, textAlign: 'center' }}>Didn't get a code?</Text>
      <Button title="Resend Code" onPress={handleResend} />
    </View>
  );
};

export default ConfirmSignUpScreen;