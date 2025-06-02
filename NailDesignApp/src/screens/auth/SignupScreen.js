import React from "react";
import {
  View,
  Text,
  Alert,
  SafeAreaView,
} from "react-native";
import { authStyles } from "../../styles/authStyles";
import { useSignupForm } from "../../hooks/auth/useSignUpForm";
import { authService } from "../../services/authServices";
import { RoleSelector } from "../../components/Auth/RoleSelector";
import { FormInput } from "../../components/Auth/FormInput";
import { GradientButton } from "../../components/Auth/GradientButton";
import { AuthHeader } from "../../components/Auth/AuthHeader";

const SignupScreen = ({ navigation }) => {
  const { formData, setters, validateForm, resetForm } = useSignupForm();

  const handleSignUp = async () => {
    if (!validateForm()) return;

    const result = await authService.signUpUser({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      role: formData.role,
    });

    if (result.success) {
      const { isSignUpComplete, nextStep } = result.data;
      
      if (isSignUpComplete) {
        Alert.alert("Signup successful!", "You can now log in.");
        navigation.navigate("Login");
      } else if (nextStep && nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        navigation.navigate("ConfirmSignUp", { email: formData.email });
      } else {
        Alert.alert("Signup initiated", "Follow the next steps provided.");
      }
      
      resetForm();
    } else {
      Alert.alert("Signup error", result.error);
    }
  };

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <View style={authStyles.screenContainer}>
        <AuthHeader 
          title="Create Account" 
          subtitle="Join us and get started" 
        />

        <View style={authStyles.card}>
          <RoleSelector
            selectedRole={formData.role}
            onRoleChange={setters.setRole}
          />

          <FormInput
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={setters.setFullName}
          />

          <FormInput
            label="Email Address"
            placeholder="your@email.com"
            value={formData.email}
            onChangeText={setters.setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FormInput
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChangeText={setters.setPassword}
            secureTextEntry={true}
          />

          <FormInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={setters.setConfirmPassword}
            secureTextEntry={true}
          />

          <GradientButton 
            title="Create Account" 
            onPress={handleSignUp} 
          />
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
