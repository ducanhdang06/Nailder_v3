// screens/customer/CustomerProfile.js
import React from "react";
import { Alert } from "react-native";
import { useUser } from "../../context/userContext";
import ProfileScreen from "../../components/ProfileScreen";
import { useSignOut } from "../../utils/useSignOut";

export default function CustomerProfile({ navigation }) {
  const { user } = useUser();
  const handleSignOut = useSignOut(navigation);

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
      icon: "📅",
      title: "My Appointments",
      onPress: () =>
        Alert.alert(
          "Coming Soon",
          "My Appointments feature will be available soon!"
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
