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
import TechnicianInfo from "../customer/TechnicianInfo";

const CustomerLayout = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("explore");
  const [currentScreen, setCurrentScreen] = useState("SwipeScreen");
  const [navigationStack, setNavigationStack] = useState([]);
  const [designDetailData, setDesignDetailData] = useState(null);
  const [chatParams, setChatParams] = useState(null);
  const [topDesignsData, setTopDesignsData] = useState(null);
  const [technicianInfoData, setTechnicianInfoData] = useState(null);
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
    if (navigationStack.length > 0) {
      const lastEntry = navigationStack[navigationStack.length - 1];
      setCurrentScreen(lastEntry.screen);
      setNavigationStack([]);
    } else {
      setCurrentScreen("CustomerSaved");
    }
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
      setNavigationStack([]); // Clear navigation stack when switching tabs
      // Clear all data when switching tabs
      setDesignDetailData(null);
      setTechnicianInfoData(null);
      setTopDesignsData(null);
      setChatParams(null);
    }
    setActiveTab(tabId);
  };

  // Navigation function for DesignDetail
  const navigateToDesignDetail = (design) => {    
    // Add current screen and its data to navigation stack
    const stackEntry = {
      screen: currentScreen,
      data: {
        designDetailData: currentScreen === "DesignDetail" ? designDetailData : null,
        technicianInfoData: currentScreen === "TechnicianInfo" ? technicianInfoData : null,
        topDesignsData: currentScreen === "AllDesignsScreen" ? topDesignsData : null,
        chatParams: currentScreen === "ChatScreen" ? chatParams : null,
      }
    };
    setNavigationStack(prev => [...prev, stackEntry]);
    setDesignDetailData(design);
    setCurrentScreen("DesignDetail");
  };

  // Navigation function for AllDesignsScreen
  const navigateToTopDesigns = (params) => {    
    // Add current screen and its data to navigation stack
    const stackEntry = {
      screen: currentScreen,
      data: {
        designDetailData: currentScreen === "DesignDetail" ? designDetailData : null,
        technicianInfoData: currentScreen === "TechnicianInfo" ? technicianInfoData : null,
        topDesignsData: currentScreen === "AllDesignsScreen" ? topDesignsData : null,
        chatParams: currentScreen === "ChatScreen" ? chatParams : null,
      }
    };
    setNavigationStack(prev => [...prev, stackEntry]);
    setTopDesignsData(params);
    setCurrentScreen("AllDesignsScreen");
  };

  // Navigation function for TechnicianInfo
  const navigateToTechnicianInfo = (params) => {    
    // Add current screen and its data to navigation stack
    const stackEntry = {
      screen: currentScreen,
      data: {
        designDetailData: currentScreen === "DesignDetail" ? designDetailData : null,
        technicianInfoData: currentScreen === "TechnicianInfo" ? technicianInfoData : null,
        topDesignsData: currentScreen === "AllDesignsScreen" ? topDesignsData : null,
        chatParams: currentScreen === "ChatScreen" ? chatParams : null,
      }
    };
    setNavigationStack(prev => [...prev, stackEntry]);
    setTechnicianInfoData(params);
    setCurrentScreen("TechnicianInfo");
  };

  const navigateToChat = (chatParams) => {    
    // Add current screen and its data to navigation stack
    const stackEntry = {
      screen: currentScreen,
      data: {
        designDetailData: currentScreen === "DesignDetail" ? designDetailData : null,
        technicianInfoData: currentScreen === "TechnicianInfo" ? technicianInfoData : null,
        topDesignsData: currentScreen === "AllDesignsScreen" ? topDesignsData : null,
        chatParams: currentScreen === "ChatScreen" ? chatParams : null,
      }
    };
    setNavigationStack(prev => [...prev, stackEntry]);
    setChatParams(chatParams);
    setCurrentScreen("ChatScreen");
  };

  // Back navigation - pop from stack and restore data
  const navigateBack = () => {
    if (navigationStack.length > 0) {
      const lastEntry = navigationStack[navigationStack.length - 1];
      setNavigationStack(prev => prev.slice(0, -1)); // Remove last item from stack
      setCurrentScreen(lastEntry.screen);
      
      // Restore the data for the screen we're going back to
      setDesignDetailData(lastEntry.data.designDetailData);
      setTechnicianInfoData(lastEntry.data.technicianInfoData);
      setTopDesignsData(lastEntry.data.topDesignsData);
      setChatParams(lastEntry.data.chatParams);
    } else {
      // Fallback to a default screen if stack is empty
      setCurrentScreen("CustomerSaved");
      // Clear all data
      setDesignDetailData(null);
      setTechnicianInfoData(null);
      setTopDesignsData(null);
      setChatParams(null);
    }
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
      } else if (screenName === "TechnicianInfo") {
        navigateToTechnicianInfo(params);
      } else {
        console.log("Fallback to original navigation:", screenName);
        navigation.navigate(screenName, params);
      }
    },
    goBack: () => {
      if (currentScreen === "ChatScreen") {
        closeChat();
      } else if (
        currentScreen === "DesignDetail" || 
        currentScreen === "AllDesignsScreen" || 
        currentScreen === "TechnicianInfo"
      ) {
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

        <View
          style={[
            layoutStyles.screen,
            currentScreen === "TechnicianInfo"
              ? layoutStyles.active
              : layoutStyles.inactive,
          ]}
        >
          {technicianInfoData && (
            <TechnicianInfo
              navigation={customNavigation}
              route={{ params: technicianInfoData }}
            />
          )}
        </View>
      </View>

      {/* Hide navbar when viewing design details, chat, all designs, or technician info */}
      {currentScreen !== "DesignDetail" && 
       currentScreen !== "ChatScreen" && 
       currentScreen !== "AllDesignsScreen" && 
       currentScreen !== "TechnicianInfo" && (
        <CustomerNavbar activeTab={activeTab} onTabPress={handleTabPress} />
      )}
    </View>
  );
};

export default CustomerLayout;
