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

const CustomerLayout = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("explore");
  const [currentScreen, setCurrentScreen] = useState("SwipeScreen");
  const [designDetailData, setDesignDetailData] = useState(null);
  const [scrollSignals, setScrollSignals] = useState({
    SwipeScreen: false,
    CustomerSearch: false,
    CustomerSaved: false,
    CustomerChat: false,
    CustomerProfile: false,
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

  // Navigation function for DesignDetail
  const navigateToDesignDetail = (design) => {
    setDesignDetailData(design);
    setCurrentScreen("DesignDetail");
  };

  // Back navigation from DesignDetail
  const navigateBack = () => {
    setCurrentScreen("CustomerSaved");
    setDesignDetailData(null);
  };

  // Custom navigation object for compatibility
  const customNavigation = {
    ...navigation,
    navigate: (screenName, params) => {
      if (screenName === 'DesignDetail') {
        navigateToDesignDetail(params.design);
      } else {
        navigation.navigate(screenName, params);
      }
    },
    goBack: () => {
      if (currentScreen === "DesignDetail") {
        navigateBack();
      } else {
        navigation.goBack();
      }
    }
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
      </View>

      {/* Hide navbar when viewing design details */}
      {currentScreen !== "DesignDetail" && (
        <CustomerNavbar activeTab={activeTab} onTabPress={handleTabPress} />
      )}
    </View>
  );
};

export default CustomerLayout;
