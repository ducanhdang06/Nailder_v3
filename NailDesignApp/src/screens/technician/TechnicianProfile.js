import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Alert 
} from "react-native";
import { signOut } from "aws-amplify/auth";
import { useUser } from "../../context/userContext";
import { authStyles } from "../../styles/authStyles";
import { uploadStyles } from "../../styles/uploadStyles";
import { profileStyles } from "../../styles/profileStyles";

const TechnicianProfile = ({ navigation }) => {
  const { setUser, user } = useUser();
  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      navigation.replace("Login");
    } catch (error) {
      console.error("Sign out error:", error);
      Alert.alert("Error", "Could not sign out. Please try again.");
    }
  };

  const actionItems = [
    {
      icon: "✏️",
      title: "Edit Profile",
      onPress: () => {
        // TODO: Navigate to edit profile screen
        Alert.alert("Coming Soon", "Edit Profile feature will be available soon!");
      }
    },
    {
      icon: "📊",
      title: "My Analytics",
      onPress: () => {
        // TODO: Navigate to analytics screen
        Alert.alert("Coming Soon", "My Analytics feature will be available soon!");
      }
    },
    {
      icon: "❓",
      title: "Support & FAQ",
      onPress: () => {
        // TODO: Navigate to support screen
        Alert.alert("Coming Soon", "Support & FAQ feature will be available soon!");
      }
    },
    {
      icon: "🚪",
      title: "Log Out",
      onPress: handleSignOut
    }
  ];

  return (
    <SafeAreaView style={authStyles.safeArea}>
      {/* Page Header */}
      <View style={uploadStyles.pageHeader}>
        <Text style={uploadStyles.pageHeaderTitle}>Profile</Text>
      </View>

      <View style={profileStyles.container}>
        {/* User Info Section */}
        <View style={profileStyles.userInfoSection}>
          <Text style={profileStyles.userName}>{user.fullName}</Text>
          <Text style={profileStyles.userEmail}>{user.email}</Text>
          <View style={profileStyles.badgeContainer}>
            <Text style={profileStyles.badgeText}>{user.role}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={profileStyles.actionsSection}>
          {actionItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={profileStyles.actionButton}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
                <View style={profileStyles.actionContent}>
                <Text style={profileStyles.actionIcon}>{item.icon}</Text>
                <Text style={profileStyles.actionTitle}>{item.title}</Text>
                <Text style={profileStyles.actionArrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TechnicianProfile;
