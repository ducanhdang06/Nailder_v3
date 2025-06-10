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
import AllDesignsScreen from "../customer/AllDesignsScreen";

const CustomerLayout = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("explore");
  const [currentScreen, setCurrentScreen] = useState("SwipeScreen");
  const [previousScreen, setPreviousScreen] = useState(null);
  const [designDetailData, setDesignDetailData] = useState(null);
  const [chatParams, setChatParams] = useState(null);
  const [topDesignsData, setTopDesignsData] = useState(null);
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
    // Remember where we came from
    setPreviousScreen(currentScreen);
    setDesignDetailData(design);
    setCurrentScreen("DesignDetail");
  };

  // Navigation function for AllDesignsScreen
  const navigateToTopDesigns = (params) => {    
    // Remember where we came from
    setPreviousScreen(currentScreen);
    setTopDesignsData(params);
    setCurrentScreen("AllDesignsScreen");
  };

  const navigateToChat = (chatParams) => {    
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
      if (screenName === "DesignDetail") {
        navigateToDesignDetail(params.design);
      } else if (screenName === "ChatScreen") {
        navigateToChat(params);
      } else if (screenName === "AllDesignsScreen") {
        navigateToTopDesigns(params);
      } else {
        console.log("Fallback to original navigation:", screenName);
        navigation.navigate(screenName, params);
      }
    },
    goBack: () => {
      if (currentScreen === "ChatScreen") {
        closeChat();
      } else if (currentScreen === "DesignDetail") {
        navigateBack();
      } else if (currentScreen === "AllDesignsScreen") {
        setCurrentScreen(previousScreen || "CustomerSearch");
        setPreviousScreen(null);
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

        <View
          style={[
            layoutStyles.screen,
            currentScreen === "AllDesignsScreen"
              ? layoutStyles.active
              : layoutStyles.inactive,
          ]}
        >
          <AllDesignsScreen
            navigation={customNavigation}
            route={{ params: topDesignsData }}
          />
        </View>
      </View>

      {/* Hide navbar when viewing design details, chat, or all designs */}
      {currentScreen !== "DesignDetail" && 
       currentScreen !== "ChatScreen" && 
       currentScreen !== "AllDesignsScreen" && (
        <CustomerNavbar activeTab={activeTab} onTabPress={handleTabPress} />
      )}
    </View>
  );
};

export default CustomerLayout;
