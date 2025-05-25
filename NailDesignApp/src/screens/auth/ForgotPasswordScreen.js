
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleRequestReset = async () => {
    try {
      await resetPassword({ username: email });
      Alert.alert('Code Sent', 'Please check your email for the confirmation code.');
      setCodeSent(true);
    } catch (error) {
      console.error('Reset error:', error);
      Alert.alert('Error', error.message || 'Could not send reset code.');
    }
  };

  const handleConfirmReset = async () => {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword
      });
      Alert.alert('Success', 'Your password has been reset.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Confirm reset error:', error);
      Alert.alert('Error', error.message || 'Could not reset password.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Forgot Password</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {codeSent && (
        <>
          <TextInput
            placeholder="Verification Code"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
          />
          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
          />
        </>
      )}

      <Button
        title={codeSent ? 'Confirm Password Reset' : 'Send Code'}
        onPress={codeSent ? handleConfirmReset : handleRequestReset}
      />

      <Text style={{ marginTop: 20 }} onPress={() => navigation.navigate('Login')}>
        Back to login
      </Text>
    </View>
  );
};

export default ForgotPasswordScreen;