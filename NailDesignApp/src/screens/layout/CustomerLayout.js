import React, { useState } from "react";
import { View } from "react-native";
import CustomerNavbar from "../../components/nav-bar/CustomerNavBar";
import { layoutStyles } from "../../styles/layoutStyles";

import CustomerChat from "../customer/CustomerChat";
import CustomerProfile from "../customer/CustomerProfile";
import CustomerSearch from "../customer/CustomerSearch";
import CustomerSaved from "../customer/CustomerSaved";
import SwipeScreen from "../customer/SwipeScreen";

const CustomerLayout = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("explore");
  const [currentScreen, setCurrentScreen] = useState("SwipeScreen");
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

  const screenProps = {
    navigation,
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
      </View>

      <CustomerNavbar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default CustomerLayout;
