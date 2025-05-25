import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import authStyles from "../../styles/authStyles";

const { width, height } = Dimensions.get("window");

const ConfirmSignUpScreen = ({ route, navigation }) => {
  const { email } = route.params || {};
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleConfirm = async () => {
    try {
      await confirmSignUp({ username: email, confirmationCode });
      Alert.alert("Success", "Email confirmed. You can now log in.");
      navigation.navigate("Login");
    } catch (err) {
      console.error("Confirmation error:", err);
      Alert.alert("Error", err.message || "Failed to confirm code");
    }
  };

  const handleResend = async () => {
    try {
      await resendSignUpCode({ username: email });
      Alert.alert(
        "Code resent",
        "A new confirmation code has been sent to your email."
      );
    } catch (err) {
      console.error("Resend error:", err);
      Alert.alert("Error", err.message || "Failed to resend code");
    }
  };

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <View style={authStyles.screenContainer}>
        <View style={authStyles.header}>
          <View style={authStyles.logoContainer}>
            <LinearGradient
              colors={["#fb7185", "#ec4899"]}
              style={authStyles.logo}
            >
              <View style={authStyles.logoInner} />
            </LinearGradient>
          </View>
          <Text style={authStyles.title}>Confirm Your Email</Text>
          <Text style={authStyles.subtitle}>
            Enter the confirmation code sent to {email}
          </Text>
        </View>

        <View style={authStyles.card}>
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Confirmation Code</Text>
            <TextInput
              placeholder="Enter 6-digit code"
              value={confirmationCode}
              onChangeText={setConfirmationCode}
              keyboardType="numeric"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
              style={authStyles.input}
            />
          </View>

          <TouchableOpacity
            style={authStyles.primaryButton}
            onPress={handleConfirm}
          >
            <LinearGradient
              colors={["#fb7185", "#ec4899"]}
              style={authStyles.buttonGradient}
            >
              <Text style={authStyles.primaryButtonText}>Confirm Email</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={authStyles.separatorContainer}>
            <View style={authStyles.separatorLine} />
            <Text style={authStyles.separatorText}>or</Text>
            <View style={authStyles.separatorLine} />
          </View>

          <TouchableOpacity
            style={authStyles.socialButton}
            onPress={handleResend}
          >
            <Text style={authStyles.socialButtonText}>Resend Code</Text>
          </TouchableOpacity>
        </View>

        <View style={authStyles.footer}>
          <Text style={authStyles.footerText}>
            Already confirmed?{" "}
            <Text
              style={authStyles.footerLink}
              onPress={() => navigation.navigate("Login")}
            >
              Sign in here
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ConfirmSignUpScreen;
