import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  fetchUserAttributes
} from 'aws-amplify/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const user = await getCurrentUser();
        const attrs = await fetchUserAttributes();
        const role = attrs['custom:userType'];

        console.log('🟢 Auto-login as:', role);

        if (role === 'technician') {
          navigation.replace('TechnicianHome');
        } else if (role === 'customer') {
          navigation.replace('CustomerHome');
        }
      } catch (err) {
        console.log('🟡 No active session:', err.name); // Expected if user is not signed in
      }
    };

    checkExistingSession();
  }, []);

  const handleLogin = async () => {
    console.log("🧪 Attempting sign in with:", { email, password });
    try {
      const user = await signIn({ username: email, password });
      console.log("✅ Signed in user:", user);

      // get the user attributes
      const attributes = await fetchUserAttributes();

      const role = attributes['custom:userType'];
      Alert.alert('Login successful!', `Role: ${role}`);
      if (role === 'technician') {
        navigation.replace('TechnicianHome');
      } else if (role === 'customer') {
        navigation.replace('CustomerHome');
      } else {
        Alert.alert('Login successful', `Unknown role: ${role}`);
      }
    } catch (err) {
      console.log("🔍 Full error object:", JSON.stringify(err, null, 2));
      console.error("Login error name:", err.name);
      console.error("Login error message:", err.message);

      Alert.alert("Login failed", `${err.name || "Unknown"}: ${err.message || "Something went wrong"}`);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, marginBottom: 20, padding: 8 }} />
      <Button title="Log In" onPress={handleLogin} />
      <Text style={{ marginTop: 20 }} onPress={() => navigation.navigate('Signup')}>Don't have an account? Sign up</Text>
      <Text style={{ marginTop: 20 }} onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password? Reset now</Text>
    </View>
  );
};

export default LoginScreen;