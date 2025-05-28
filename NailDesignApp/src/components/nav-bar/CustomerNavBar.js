import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import navbarStyles from "../../styles/navbarStyles";

const CustomerNavbar = ({ activeTab, onTabPress }) => {
  const tabs = [
    {
      id: "search",
      label: "Search",
      iconOutlined: "search-outline",
      iconFilled: "search",
      screen: "CustomerSearch",
    },
    {
      id: "saved",
      label: "Saved",
      iconOutlined: "bookmark-outline",
      iconFilled: "bookmark",
      screen: "CustomerSaved",
    },
    {
      id: "explore",
      label: "",
      iconOutlined: "compass",
      iconFilled: "compass",
      screen: "SwipeScreen",
      isSpecial: true,
    },
    {
      id: "chat",
      label: "Chat",
      iconOutlined: "chatbubble-outline",
      iconFilled: "chatbubble",
      screen: "CustomerChat",
    },
    {
      id: "profile",
      label: "Profile",
      iconOutlined: "person-outline",
      iconFilled: "person",
      screen: "CustomerProfile",
    },
  ];

  const renderTab = (tab) => {
    const isActive = activeTab === tab.id;
    const iconName = isActive ? tab.iconFilled : tab.iconOutlined;

    if (tab.isSpecial) {
      // Special styling for the + button (TikTok style)
      return (
        <TouchableOpacity
          key={tab.id}
          style={navbarStyles.specialTab}
          onPress={() => onTabPress(tab.screen, tab.id)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={["#fb7185", "#ec4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={navbarStyles.specialTabInner}
          >
            <Ionicons name={iconName} size={36} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={tab.id}
        style={navbarStyles.tab}
        onPress={() => onTabPress(tab.screen, tab.id)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={iconName}
          size={24}
          color={isActive ? "#fb7185" : "#000000"}
        />
        <Text
          style={[
            navbarStyles.tabLabel,
            { color: isActive ? "#fb7185" : "#00000" },
          ]}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={navbarStyles.container}>
      <View style={navbarStyles.navbar}>{tabs.map(renderTab)}</View>
    </View>
  );
};

export default CustomerNavbar;