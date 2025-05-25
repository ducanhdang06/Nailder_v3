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
import { Auth } from "aws-amplify";
import { signUp } from "aws-amplify/auth";
import authStyles from "../../styles/authStyles";

const { width, height } = Dimensions.get("window");

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer"); // or 'technician'

  const handleSignUp = async () => {
    // Assuming:
    // - email, password, confirmPassword, fullName, role are state variables or props
    // - navigation is a valid navigation prop (e.g., from React Navigation)
    // - Alert is from React Native or a similar UI library

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match"); // Good practice to have a title for Alert
      return;
    }

    // console.log("Auth object: ", Auth); // This line can be removed as Auth class is not used directly
    console.log("Attempting signup with:", { email, fullName, role }); // Log relevant data

    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email, // In Cognito, username is often the email by default
        password,
        options: {
          // For v6+, custom attributes and autoSignIn go into options
          userAttributes: {
            email, // Standard attribute
            name: fullName, // Standard attribute
            "custom:userType": role, // Custom attribute
          },
          // autoSignIn: true // Optional: signs in the user automatically after confirmation
        },
      });

      console.log("Signup successful:", { isSignUpComplete, userId, nextStep });
      console.log("🧭 navigation object:", navigation);
      console.log("Next Step:", nextStep);
      if (isSignUpComplete) {
        Alert.alert("Signup successful!", "You can now log in.");
        // If autoSignIn is false or confirmation is required,
        // you might navigate to a confirmation screen instead.
        // For example: navigation.navigate("ConfirmSignUp", { username: email });
        navigation.navigate("Login");
      } else if (nextStep && nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        navigation.navigate("ConfirmSignUp", { email });
      } else {
        // Handle other potential next steps if necessary
        Alert.alert("Signup initiated", "Follow the next steps provided.");
      }
    } catch (err) {
      console.error("Signup error object:", err);
      Alert.alert(
        "Signup error",
        err.message || "An unexpected error occurred. Please try again."
      );
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
          <Text style={authStyles.title}>Create Account</Text>
          <Text style={authStyles.subtitle}>Join us and get started</Text>
        </View>

        <View style={authStyles.card}>
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>I am a</Text>
            <View style={authStyles.roleToggleContainer}>
              <TouchableOpacity
                style={[
                  authStyles.roleToggleButton,
                  role === "customer" && authStyles.roleToggleButtonActive,
                ]}
                onPress={() => setRole("customer")}
              >
                <Text
                  style={[
                    authStyles.roleToggleText,
                    role === "customer" && authStyles.roleToggleTextActive,
                  ]}
                >
                  Customer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  authStyles.roleToggleButton,
                  role === "technician" && authStyles.roleToggleButtonActive,
                ]}
                onPress={() => setRole("technician")}
              >
                <Text
                  style={[
                    authStyles.roleToggleText,
                    role === "technician" && authStyles.roleToggleTextActive,
                  ]}
                >
                  Technician
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Full Name</Text>
            <TextInput
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor="#9ca3af"
              style={authStyles.input}
            />
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Email Address</Text>
            <TextInput
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
              style={authStyles.input}
            />
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Password</Text>
            <TextInput
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9ca3af"
              style={authStyles.input}
            />
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Confirm Password</Text>
            <TextInput
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#9ca3af"
              style={authStyles.input}
            />
          </View>

          <TouchableOpacity
            style={authStyles.primaryButton}
            onPress={handleSignUp}
          >
            <LinearGradient
              colors={["#fb7185", "#ec4899"]}
              style={authStyles.buttonGradient}
            >
              <Text style={authStyles.primaryButtonText}>Create Account</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={authStyles.footer}>
          <Text style={authStyles.footerText}>
            Already have an account?{" "}
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

export default SignupScreen;
