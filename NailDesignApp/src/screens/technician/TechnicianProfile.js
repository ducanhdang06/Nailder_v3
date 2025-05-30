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

      <View style={styles.container}>
        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{user.role}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {actionItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.actionContent}>
                <Text style={styles.actionIcon}>{item.icon}</Text>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <Text style={styles.actionArrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  userInfoSection: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    marginBottom: 32,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  badgeContainer: {
    backgroundColor: '#ddd6fe',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c4b5fd',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5b21b6',
    letterSpacing: 1,
  },
  actionsSection: {
    flex: 1,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
    textAlign: 'center',
  },
  actionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  actionArrow: {
    fontSize: 24,
    color: '#9ca3af',
    fontWeight: '300',
  },
});

export default TechnicianProfile;
