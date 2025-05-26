import React, { useState } from "react";
import { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  fetchUserAttributes,
} from "aws-amplify/auth";
import authStyles from "../../styles/authStyles";
import GradientButton from "../../components/GradientButton";
const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const user = await getCurrentUser();
        const attrs = await fetchUserAttributes();
        const role = attrs["custom:userType"];

        console.log("🟢 Auto-login as:", role);

        if (role === "technician") {
          navigation.replace("TechnicianHome");
        } else if (role === "customer") {
          navigation.replace("CustomerHome");
        }
      } catch (err) {
        console.log("🟡 No active session:", err.name); // Expected if user is not signed in
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

      const role = attributes["custom:userType"];
      Alert.alert("Login successful!", `Role: ${role}`);
      if (role === "technician") {
        navigation.replace("TechnicianHome");
      } else if (role === "customer") {
        navigation.replace("CustomerHome");
      } else {
        Alert.alert("Login successful", `Unknown role: ${role}`);
      }
    } catch (err) {
      console.log("🔍 Full error object:", JSON.stringify(err, null, 2));
      console.error("Login error name:", err.name);
      console.error("Login error message:", err.message);

      Alert.alert(
        "Login failed",
        `${err.name || "Unknown"}: ${err.message || "Something went wrong"}`
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
          <Text style={authStyles.title}>Welcome Back</Text>
          <Text style={authStyles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={authStyles.card}>
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Email Address</Text>
            <TextInput
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              style={authStyles.input}
            />
          </View>

          <View style={authStyles.inputContainer}>
            <View style={authStyles.labelRow}>
              <Text style={authStyles.label}>Password</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={authStyles.footerLink}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Enter your password"
              value={password}
              placeholderTextColor="#9ca3af"
              onChangeText={setPassword}
              secureTextEntry
              style={authStyles.input}
            />
          </View>

          <TouchableOpacity
            style={authStyles.primaryButton}
            onPress={handleLogin}
          >
            <LinearGradient
              colors={["#fb7185", "#ec4899"]}
              style={authStyles.buttonGradient}
            >
              <Text style={authStyles.primaryButtonText}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={authStyles.separatorContainer}>
            <View style={authStyles.separatorLine} />
            <Text style={authStyles.separatorText}>or</Text>
            <View style={authStyles.separatorLine} />
          </View>

          <TouchableOpacity
            style={authStyles.socialButton}
            // onPress={handleAppleSignIn}
          >
            <Image
              source={require("../../assets/google-logo.png")} // Transparent background PNG
              style={authStyles.socialIcon}
            />
            <Text style={authStyles.socialButtonText}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={authStyles.socialButton}
              // onPress={handleAppleSignIn}
            >
              <Image
                source={require("../../assets/apple-logo.png")} 
                style={authStyles.socialIcon}
              />
              <Text style={authStyles.socialButtonText}>
                Continue with Apple
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={authStyles.footer}>
          <Text style={authStyles.footerText}>
            Don't have an account?{" "}
            <Text
              style={authStyles.footerLink}
              onPress={() => navigation.navigate("Signup")}
            >
              Sign up here
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
