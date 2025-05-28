import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TechnicianNavBar from '../components/nav-bar/TechnicianNavBar';

// Import your screen components
import TechnicianHome from './technician/TechnicianHome';
import TechnicianChat from './technician/TechnicianChat';
import UploadDesignScreen from './technician/UploadDesignScreen';
import TechnicianPosted from './technician/TechnicianPosted';
import TechnicianProfile from './technician/TechnicianProfile';

const TechnicianLayout = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('TechnicianHome');

  const handleTabPress = (screen, tabId) => {
    setActiveTab(tabId);
    setCurrentScreen(screen);
  };

  const navigateToHome = () => {
    setActiveTab('home');
    setCurrentScreen('TechnicianHome');
  };

  const renderCurrentScreen = () => {
    const screenProps = { 
      navigation,
      navigateToHome // Pass this function to UploadDesignScreen
    };
    
    switch (currentScreen) {
      case 'TechnicianHome':
        return <TechnicianHome {...screenProps} />;
      case 'TechnicianChat':
        return <TechnicianChat {...screenProps} />;
      case 'UploadDesign':
        return <UploadDesignScreen {...screenProps} />;
      case 'TechnicianPosted':
        return <TechnicianPosted {...screenProps} />;
      case 'TechnicianProfile':
        return <TechnicianProfile {...screenProps} />;
      default:
        return <TechnicianHome {...screenProps} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderCurrentScreen()}
      </View>
      <TechnicianNavBar 
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

export default TechnicianLayout;