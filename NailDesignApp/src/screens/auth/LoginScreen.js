import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { authStyles } from "../../styles/authStyles";
import { useUser } from "../../context/userContext";
import { useLoginForm } from "../../hooks/auth/useLoginForm";
import { useAutoLogin } from "../../hooks/auth/useAutoLogin";
import { useLoginHandler } from "../../hooks/auth/useLoginHandler";
import { AuthHeader } from "../../components/Auth/AuthHeader";
import { LoginForm } from "../../components/Auth/LoginForm";
import { GradientButton } from "../../components/Auth/GradientButton";
import { SocialLoginButtons } from "../../components/Auth/SocialLoginButton";

const LoginScreen = ({ navigation }) => {
  const { reloadUser } = useUser();
  const { formData, setters, validateForm, resetForm } = useLoginForm();
  const { handleLogin, handleSignOut } = useLoginHandler(navigation, reloadUser);
  
  // Auto-login check on mount
  useAutoLogin(navigation, reloadUser);

  const onLoginPress = async () => {
    if (!validateForm()) return;
    await handleLogin(formData.email, formData.password);
    resetForm();
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login not implemented yet`);
    // TODO: Implement social login
  };

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <View style={authStyles.screenContainer}>
        <AuthHeader 
          title="Welcome Back" 
          subtitle="Sign in to your account" 
        />

        <View style={authStyles.card}>
          <LoginForm
            email={formData.email}
            password={formData.password}
            onEmailChange={setters.setEmail}
            onPasswordChange={setters.setPassword}
            onForgotPassword={() => navigation.navigate("ForgotPassword")}
          />

          <GradientButton 
            title="Sign In" 
            onPress={onLoginPress} 
          />

          <SocialLoginButtons
            onGooglePress={() => handleSocialLogin('Google')}
            onApplePress={() => handleSocialLogin('Apple')}
          />

          <TouchableOpacity onPress={handleSignOut}>
            <Text style={authStyles.socialButtonText}>Reset Session</Text>
          </TouchableOpacity>
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
