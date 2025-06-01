import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import TechnicianNavBar from "../components/nav-bar/TechnicianNavBar";

// Import your screen components
import TechnicianHome from "./technician/TechnicianHome";
import TechnicianChat from "./technician/TechnicianChat";
import UploadDesignScreen from "./technician/UploadDesignScreen";
import TechnicianPosted from "./technician/TechnicianPosted";
import TechnicianProfile from "./technician/TechnicianProfile";

import { layoutStyles } from "../styles/layoutStyles";

const TechnicianLayout = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("home");
  const [currentScreen, setCurrentScreen] = useState("TechnicianHome");
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

  const screenProps = { navigation };

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
            currentScreen === "TechnicianProfile"
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
      </View>

      <TechnicianNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default TechnicianLayout;
