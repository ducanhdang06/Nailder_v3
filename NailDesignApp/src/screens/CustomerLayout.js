import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomerNavbar from '../components/nav-bar/CustomerNavBar';

// Import your screen components
import CustomerChat from './customer/CustomerChat';
import CustomerProfile from './customer/CustomerProfile';
import CustomerSearch from './customer/CustomerSearch';
import CustomerSaved from './customer/CustomerSaved';
import SwipeScreen from './customer/SwipeScreen';

const CustomerLayout = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('explore');
  const [currentScreen, setCurrentScreen] = useState('SwipeScreen');

  const handleTabPress = (screen, tabId) => {
    setActiveTab(tabId);
    setCurrentScreen(screen);
  };

  const renderCurrentScreen = () => {
    const screenProps = { 
      navigation,
    };
    
    switch (currentScreen) {
      case 'CustomerSearch':
        console.log("going to customer search");
        return <CustomerSearch {...screenProps} />;
      case 'CustomerSaved':
        console.log("going to customer saved");
        return <CustomerSaved {...screenProps} />;
      case 'SwipeScreen':
        console.log("going to swipe screen");
        return <SwipeScreen {...screenProps} />;
      case 'CustomerChat':
        console.log("going to customer chat");
        return <CustomerChat {...screenProps} />;
      case 'CustomerProfile':
        console.log("going to customer profile");
        return <CustomerProfile {...screenProps} />;
      default:
        return <SwipeScreen {...screenProps} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderCurrentScreen()}
      </View>
      <CustomerNavbar 
        activeTab={activeTab} 
        onTabPress={handleTabPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingBottom: 90, // Space for the navbar
  },
});

export default CustomerLayout;