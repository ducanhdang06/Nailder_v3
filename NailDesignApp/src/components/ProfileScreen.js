// components/ProfileScreen.js
import React from "react";
import { View, Text, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { authStyles } from "../styles/authStyles";
import { uploadStyles } from "../styles/uploadStyles";
import { profileStyles } from "../styles/profileStyles";

export default function ProfileScreen({ user, navigation, actionItems }) {
  return (
    <SafeAreaView style={authStyles.safeArea}>
      {/* Header */}
      <View style={uploadStyles.pageHeader}>
        <Text style={uploadStyles.pageHeaderTitle}>Profile</Text>
      </View>

      <View style={profileStyles.container}>
        {/* User Info */}
        <View style={profileStyles.userInfoSection}>
          <Text style={profileStyles.userName}>{user.fullName}</Text>
          <Text style={profileStyles.userEmail}>{user.email}</Text>
          <View style={profileStyles.badgeContainer}>
            <Text style={profileStyles.badgeText}>{user.role}</Text>
          </View>
        </View>

        {/* Action Items */}
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
}
