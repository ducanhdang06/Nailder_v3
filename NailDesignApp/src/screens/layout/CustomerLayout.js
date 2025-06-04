import React, { useState } from "react";
import { View } from "react-native";
import CustomerNavbar from "../../components/NavBar/CustomerNavBar";
import { layoutStyles } from "../../styles/layoutStyles";

import CustomerChat from "../customer/CustomerChat";
import CustomerProfile from "../customer/CustomerProfile";
import CustomerSearch from "../customer/CustomerSearch";
import CustomerSaved from "../customer/CustomerSaved";
import SwipeScreen from "../customer/SwipeScreen";
import DesignDetailScreen from "../customer/DesignDetailScreen";
import ChatScreen from "../customer/ChatScreen";

const CustomerLayout = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("explore");
  const [currentScreen, setCurrentScreen] = useState("SwipeScreen");
  const [previousScreen, setPreviousScreen] = useState(null);
  const [designDetailData, setDesignDetailData] = useState(null);
  const [chatParams, setChatParams] = useState(null);
  const [scrollSignals, setScrollSignals] = useState({
    SwipeScreen: false,
    CustomerSearch: false,
    CustomerSaved: false,
    CustomerChat: false,
    CustomerProfile: false,
  });

  const openChat = (chatData) => {
    setChatParams(chatData);
    setCurrentScreen("ChatScreen");
  };

  const closeChat = () => {
    setChatParams(null);
    setCurrentScreen(previousScreen || "CustomerSaved");
    setPreviousScreen(null);
  };

  const handleTabPress = (screen, tabId) => {
    if (currentScreen === screen) {
      // Toggle scroll signal to force scroll-to-top
      setScrollSignals((prev) => ({
        ...prev,
        [screen]: !prev[screen],
      }));
    } else {
      setCurrentScreen(screen);
    }
    setActiveTab(tabId);
  };

  // Navigation function for DesignDetail
  const navigateToDesignDetail = (design) => {
    console.log("=== CUSTOMER LAYOUT NAVIGATE TO DESIGN DETAIL ===");
    console.log("Design received:", JSON.stringify(design, null, 2));
    console.log("Design type:", typeof design);
    console.log("Current screen before navigation:", currentScreen);
    console.log("=================================================");
    
    // Remember where we came from
    setPreviousScreen(currentScreen);
    setDesignDetailData(design);
    setCurrentScreen("DesignDetail");
  };

  const navigateToChat = (chatParams) => {
    console.log("=== CUSTOMER LAYOUT NAVIGATE TO CHAT ===");
    console.log("Chat params:", JSON.stringify(chatParams, null, 2));
    console.log("Current screen before navigation:", currentScreen);
    console.log("========================================");
    
    // Remember where we came from
    setPreviousScreen(currentScreen);
    setChatParams(chatParams);
    setCurrentScreen("ChatScreen");
  };

  // Back navigation from DesignDetail
  const navigateBack = () => {
    // Go back to the previous screen or default to CustomerSaved
    setCurrentScreen(previousScreen || "CustomerSaved");
    setDesignDetailData(null);
    setPreviousScreen(null); // Reset previous screen
  };

  // Custom navigation object for compatibility
  const customNavigation = {
    ...navigation,
    navigate: (screenName, params) => {
      console.log("=== CUSTOM NAVIGATION CALLED ===");
      console.log("Screen name:", screenName);
      console.log("Params:", JSON.stringify(params, null, 2));
      console.log("================================");
      
      if (screenName === "DesignDetail") {
        navigateToDesignDetail(params.design);
      } else if (screenName === "ChatScreen") {
        navigateToChat(params);
      } else {
        console.log("Fallback to original navigation:", screenName);
        navigation.navigate(screenName, params);
      }
    },
    goBack: () => {
      console.log("=== CUSTOM NAVIGATION GO BACK ===");
      console.log("Current screen:", currentScreen);
      console.log("==================================");
      
      if (currentScreen === "ChatScreen") {
        closeChat();
      } else if (currentScreen === "DesignDetail") {
        navigateBack();
      } else {
        navigation.goBack();
      }
    },
  };

  const screenProps = {
    navigation: customNavigation,
  };

  return (
    <View style={layoutStyles.container}>
      <View style={layoutStyles.content}>
        <View
          style={[
            layoutStyles.screen,
            currentScreen === "SwipeScreen"
              ? layoutStyles.active
              : layoutStyles.inactive,
          ]}
        >
          <SwipeScreen
            {...screenProps}
            scrollToTopSignal={scrollSignals["SwipeScreen"]}
          />
        </View>
        <View
          style={[
            layoutStyles.screen,
            currentScreen === "CustomerSearch"
              ? layoutStyles.active
              : layoutStyles.inactive,
          ]}
        >
          <CustomerSearch
            {...screenProps}
            scrollToTopSignal={scrollSignals["CustomerSearch"]}
          />
        </View>
        <View
          style={[
            layoutStyles.screen,
            currentScreen === "CustomerSaved"
              ? layoutStyles.active
              : layoutStyles.inactive,
          ]}
        >
          <CustomerSaved
            {...screenProps}
            scrollToTopSignal={scrollSignals["CustomerSaved"]}
          />
        </View>
        <View
          style={[
            layoutStyles.screen,
            currentScreen === "CustomerChat"
              ? layoutStyles.active
              : layoutStyles.inactive,
          ]}
        >
          <CustomerChat
            {...screenProps}
            scrollToTopSignal={scrollSignals["CustomerChat"]}
          />
        </View>
        <View
          style={[
            layoutStyles.screen,
            currentScreen === "CustomerProfile"
              ? layoutStyles.active
              : layoutStyles.inactive,
          ]}
        >
          <CustomerProfile
            {...screenProps}
            scrollToTopSignal={scrollSignals["CustomerProfile"]}
          />
        </View>
        <View
          style={[
            layoutStyles.screen,
            currentScreen === "DesignDetail"
              ? layoutStyles.active
              : layoutStyles.inactive,
          ]}
        >
          {(() => {
            console.log("=== DESIGN DETAIL RENDER CHECK ===");
            console.log("Current screen:", currentScreen);
            console.log("designDetailData:", JSON.stringify(designDetailData, null, 2));
            console.log("designDetailData exists:", !!designDetailData);
            console.log("==================================");
            return null;
          })()}
          {designDetailData && (
            <DesignDetailScreen
              navigation={customNavigation}
              route={{ params: { design: designDetailData } }}
            />
          )}
        </View>

        <View
          style={[
            layoutStyles.screen,
            currentScreen === "ChatScreen"
              ? layoutStyles.active
              : layoutStyles.inactive,
          ]}
        >
          {chatParams && (
            <ChatScreen
              navigation={customNavigation}
              route={{ params: chatParams }}
            />
          )}
        </View>
      </View>

      {/* Hide navbar when viewing design details */}
      {currentScreen !== "DesignDetail" && currentScreen !== "ChatScreen" && (
        <CustomerNavbar activeTab={activeTab} onTabPress={handleTabPress} />
      )}
    </View>
  );
};

export default CustomerLayout;
