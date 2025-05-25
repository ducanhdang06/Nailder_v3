import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { signOut } from 'aws-amplify/auth'

const TechnicianHome = ({navigation}) => {
    const handleSignOut = async () => {
        try {
          await signOut();
          navigation.replace('Login'); // or navigation.navigate
        } catch (error) {
          console.error('Sign out error:', error);
          Alert.alert('Error', 'Could not sign out. Please try again.');
        }
      };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, Technician!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TechnicianHome;