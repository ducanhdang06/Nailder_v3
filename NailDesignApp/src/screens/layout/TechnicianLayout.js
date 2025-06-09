import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import TechnicianNavBar from "../../components/NavBar/TechnicianNavBar";

// Import your screen components
import TechnicianHome from "../technician/TechnicianHome";
import TechnicianChat from "../technician/TechnicianChat";
import UploadDesignScreen from "../technician/UploadDesignScreen";
import TechnicianPosted from "../technician/TechnicianPosted";
import TechnicianProfile from "../technician/TechnicianProfile";
import TechnicianChatScreen from "../technician/TechnicianChatScreen";

import { layoutStyles } from "../../styles/layoutStyles";

const TechnicianLayout = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("home");
  const [currentScreen, setCurrentScreen] = useState("TechnicianHome");
  const [previousScreen, setPreviousScreen] = useState(null);
  const [chatParams, setChatParams] = useState(null);
  const [scrollSignals, setScrollSignals] = useState({
    TechnicianHome: false,
    TechnicianPosted: false,
    UploadDesign: false,
    TechnicianProfile: false,
    TechnicianChat: false,
  });

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

  const navigateToChat = (chatParams) => {
    console.log("=== TECHNICIAN LAYOUT NAVIGATE TO CHAT ===");
    console.log("Chat params:", JSON.stringify(chatParams, null, 2));
    console.log("Current screen before navigation:", currentScreen);
    console.log("==========================================");
    
    // Remember where we came from
    setPreviousScreen(currentScreen);
    setChatParams(chatParams);
    setCurrentScreen("TechnicianChatScreen");
  };

  const closeChat = () => {
    setChatParams(null);
    setCurrentScreen(previousScreen || "TechnicianChat");
    setPreviousScreen(null);
  };

  // Custom navigation object for compatibility
  const customNavigation = {
    ...navigation,
    navigate: (screenName, params) => {
      console.log("=== TECHNICIAN CUSTOM NAVIGATION CALLED ===");
      console.log("Screen name:", screenName);
      console.log("Params:", JSON.stringify(params, null, 2));
      console.log("===========================================");
      
      if (screenName === "TechnicianChatScreen") {
        navigateToChat(params);
      } else {
        console.log("Fallback to original navigation:", screenName);
        navigation.navigate(screenName, params);
      }
    },
    goBack: () => {
      console.log("=== TECHNICIAN CUSTOM NAVIGATION GO BACK ===");
      console.log("Current screen:", currentScreen);
      console.log("============================================");
      
      if (currentScreen === "TechnicianChatScreen") {
        closeChat();
      } else {
        navigation.goBack();
      }
    },
  };

  const screenProps = { navigation: customNavigation };

  return (
    <View style={layoutStyles.container}>
      <View style={layoutStyles.content}>
        <View
          style={[
            layoutStyles.screen,
            currentScreen === "TechnicianHome"
              ? layoutStyles.active
              : layoutStyles.inactive,
          ]}
        >
          <TechnicianHome
            {...screenProps}
            scrollToTopSignal={scrollSignals["TechnicianHome"]}
          />
        </View>
        <View
          style={[
            layoutStyles.screen,
            currentScreen === "TechnicianPosted"
              ? layoutStyles.active
              : layoutStyles.inactive,
          ]}
        >
          <TechnicianPosted
            {...screenProps}
            scrollToTopSignal={scrollSignals["TechnicianPosted"]}
          />
        </View>
        <View
          style={[
            layoutStyles.screen,
            currentScreen === "UploadDesign"
              ? layoutStyles.active
              : layoutStyles.inactive,
          ]}
        >
          <UploadDesignScreen
            {...screenProps}
            scrollToTopSignal={scrollSignals["UploadDesign"]}
          />
        </View>
        <View
          style={[
            layoutStyles.screen,
            currentScreen === "TechnicianChat"
              ? layoutStyles.active
              : layoutStyles.inactive,
          ]}
        >
          <TechnicianChat
            {...screenProps}
            scrollToTopSignal={scrollSignals["TechnicianChat"]}
          />
        </View>
        <View
          style={[
            layoutStyles.screen,
            currentScreen === "TechnicianProfile"
              ? layoutStyles.active
              : layoutStyles.inactive,
          ]}
        >
          <TechnicianProfile
            {...screenProps}
            scrollToTopSignal={scrollSignals["TechnicianProfile"]}
          />
        </View>

        {/* TechnicianChatScreen - Similar to CustomerLayout's ChatScreen */}
        <View
          style={[
            layoutStyles.screen,
            currentScreen === "TechnicianChatScreen"
              ? layoutStyles.active
              : layoutStyles.inactive,
          ]}
        >
          {chatParams && (
            <TechnicianChatScreen
              navigation={customNavigation}
              route={{ params: chatParams }}
            />
          )}
        </View>
      </View>

      {/* Hide navbar when viewing chat screen */}
      {currentScreen !== "TechnicianChatScreen" && (
        <TechnicianNavBar activeTab={activeTab} onTabPress={handleTabPress} />
      )}
    </View>
  );
};

export default TechnicianLayout;
