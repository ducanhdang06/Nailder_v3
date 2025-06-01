import { useCallback } from "react";
import { signOut } from "aws-amplify/auth";
import { Alert } from "react-native";
import { useUser } from "../context/userContext";

export const useSignOut = (navigation) => {
  const { setUser } = useUser();

  return useCallback(async () => {
    try {
      await signOut();
      setUser(null);
      navigation.replace("Login");
    } catch (error) {
      console.error("Sign out error:", error);
      Alert.alert("Error", "Could not sign out. Please try again.");
    }
  }, [navigation, setUser]);
};
