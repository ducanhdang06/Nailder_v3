import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { Auth } from "aws-amplify";
import { signUp } from "aws-amplify/auth";

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
      console.log("Next Step:", nextStep)
      if (isSignUpComplete) {
        Alert.alert("Signup successful!", "You can now log in.");
        // If autoSignIn is false or confirmation is required,
        // you might navigate to a confirmation screen instead.
        // For example: navigation.navigate("ConfirmSignUp", { username: email });
        navigation.navigate("Login");
      } else if (nextStep && nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        navigation.navigate("ConfirmSignUp", { email});
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
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Sign Up</Text>
      <Text>Role:</Text>
      <View style={{ flexDirection: "row", marginVertical: 10 }}>
        <Button
          title="Customer"
          onPress={() => setRole("customer")}
          color={role === "customer" ? "blue" : "gray"}
        />
        <Button
          title="Technician"
          onPress={() => setRole("technician")}
          color={role === "technician" ? "blue" : "gray"}
        />
      </View>
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Text
        style={{ marginTop: 20 }}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? Log in
      </Text>
    </View>
  );
};

export default SignupScreen;
