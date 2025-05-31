import { StyleSheet, Platform } from "react-native";

export const layoutStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    content: {
      flex: 1,
      paddingBottom: 90, 
      position: 'relative',
    },
    screen: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 0,
    },
    active: {
      display: 'flex',
    },
    inactive: {
      display: 'none',
    },
  });