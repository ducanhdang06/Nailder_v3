// Purpose: Handles all AWS Amplify authentication operations

// Responsibilities:
// Encapsulates signup API calls
// Manages error handling for auth operations
// Provides consistent response format
// Logs authentication attempts and results

import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  fetchUserAttributes,
} from "aws-amplify/auth";
import { Alert } from "react-native";

export const authService = {
  // Sign up user aws
  async signUpUser({ email, password, fullName, role }) {
    try {
      console.log("Attempting signup with:", { email, fullName, role });

      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name: fullName,
            "custom:userType": role,
          },
        },
      });

      console.log("Signup successful:", { isSignUpComplete, userId, nextStep });

      return {
        success: true,
        data: { isSignUpComplete, userId, nextStep },
      };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        error:
          error.message || "An unexpected error occurred. Please try again.",
      };
    }
  },

  // Sign in user aws
  async signInUser({ email, password }) {
    try {
      console.log("🧪 Attempting sign in with:", { email });

      const user = await signIn({ username: email, password });
      console.log("✅ Signed in user:", user);

      const attributes = await fetchUserAttributes();
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      console.log("🔑 Auth session obtained");

      return {
        success: true,
        data: {
          user,
          attributes,
          token,
          role: attributes["custom:userType"],
        },
      };
    } catch (error) {
      console.log("🔍 Full error object:", JSON.stringify(error, null, 2));
      console.error("Login error:", error.name, error.message);

      return {
        success: false,
        error: `${error.name || "Unknown"}: ${
          error.message || "Something went wrong"
        }`,
      };
    }
  },

  // Basic sign out (existing method)
  async signOutUser() {
    try {
      await signOut();
      console.log("Reset/Logout");
      return { success: true };
    } catch (error) {
      console.error("Signout error:", error);
      return {
        success: false,
        error: "Could not sign out. Please try again.",
      };
    }
  },

  // Enhanced sign out with navigation and user context clearing
  async signOutWithNavigation({ navigation, setUser, showAlert = true }) {
    try {
      await signOut();
      setUser(null);
      navigation.replace("Login");
      console.log("Complete sign out with navigation");
      return { success: true };
    } catch (error) {
      console.error("Sign out error:", error);
      if (showAlert) {
        Alert.alert("Error", "Could not sign out. Please try again.");
      }
      return {
        success: false,
        error: "Could not sign out. Please try again.",
      };
    }
  },

  async getCurrentSession() {
    try {
      const user = await getCurrentUser();
      const attrs = await fetchUserAttributes();
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      const role = attrs["custom:userType"];

      return {
        success: true,
        data: {
          user,
          attributes: attrs,
          token,
          role,
        },
      };
    } catch (error) {
      console.log("🟡 No active session:", error.name);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};
