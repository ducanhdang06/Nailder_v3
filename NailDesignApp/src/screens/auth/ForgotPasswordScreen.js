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
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import authStyles from "../../styles/authStyles";

const { width, height } = Dimensions.get("window");

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleRequestReset = async () => {
    try {
      await resetPassword({ username: email });
      Alert.alert(
        "Code Sent",
        "Please check your email for the confirmation code."
      );
      setCodeSent(true);
    } catch (error) {
      console.error("Reset error:", error);
      Alert.alert("Error", error.message || "Could not send reset code.");
    }
  };

  const handleConfirmReset = async () => {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
      Alert.alert("Success", "Your password has been reset.");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Confirm reset error:", error);
      Alert.alert("Error", error.message || "Could not reset password.");
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
          <Text style={authStyles.title}>
            {codeSent ? "Reset Password" : "Forgot Password"}
          </Text>
          <Text style={authStyles.subtitle}>
            {codeSent
              ? "Enter the code and your new password"
              : "Enter your email to receive a reset code"}
          </Text>
        </View>

        <View style={authStyles.card}>
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Email Address</Text>
            <TextInput
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
              editable={!codeSent}
              style={[
                authStyles.input,
                codeSent && { backgroundColor: "#f9fafb", color: "#6b7280" },
              ]}
            />
          </View>

          {codeSent && (
            <>
              <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>Verification Code</Text>
                <TextInput
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="numeric"
                  placeholderTextColor="#9ca3af"
                  style={authStyles.input}
                />
              </View>
              <View style={authStyles.inputContainer}>
                <Text style={authStyles.label}>New Password</Text>
                <TextInput
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholderTextColor="#9ca3af"
                  style={authStyles.input}
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={authStyles.primaryButton}
            onPress={codeSent ? handleConfirmReset : handleRequestReset}
          >
            <LinearGradient
              colors={["#fb7185", "#ec4899"]}
              style={authStyles.buttonGradient}
            >
              <Text style={authStyles.primaryButtonText}>
                {codeSent ? "Reset Password" : "Send Reset Code"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {codeSent && (
            <>
              <View style={authStyles.separatorContainer}>
                <View style={authStyles.separatorLine} />
                <Text style={authStyles.separatorText}>or</Text>
                <View style={authStyles.separatorLine} />
              </View>

              <TouchableOpacity
                style={authStyles.socialButton}
                onPress={() => setCodeSent(false)}
              >
                <Text style={authStyles.socialButtonText}>
                  Use Different Email
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={authStyles.footer}>
          <Text style={authStyles.footerText}>
            Remember your password?{" "}
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

export default ForgotPasswordScreen;
