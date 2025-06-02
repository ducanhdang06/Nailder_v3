// screens/technician/TechnicianProfile.js
import React from "react";
import { Alert } from "react-native";
import { useUser } from "../../context/userContext";
import ProfileScreen from "../../components/Common/ProfileScreen";
import { authService } from "../../services/authServices";

export default function TechnicianProfile({ navigation }) {
  const { user, setUser } = useUser();

  
  const handleSignOut = async () => {
    const result = await authService.signOutWithNavigation({
      navigation,
      setUser,
      showAlert: true, // This will show error alerts if sign out fails
    });

    if (!result.success) {
      console.error("Sign out failed:", result.error);
      // Error alert is already handled by the authService method
    }
  };

  const actionItems = [
    {
      icon: "✏️",
      title: "Edit Profile",
      onPress: () =>
        Alert.alert(
          "Coming Soon",
          "Edit Profile feature will be available soon!"
        ),
    },
    {
      icon: "📊",
      title: "My Analytics",
      onPress: () =>
        Alert.alert(
          "Coming Soon",
          "My Analytics feature will be available soon!"
        ),
    },
    {
      icon: "❓",
      title: "Support & FAQ",
      onPress: () =>
        Alert.alert(
          "Coming Soon",
          "Support & FAQ feature will be available soon!"
        ),
    },
    { icon: "🚪", title: "Log Out", onPress: handleSignOut },
  ];

  return (
    <ProfileScreen
      user={user}
      navigation={navigation}
      actionItems={actionItems}
    />
  );
}
