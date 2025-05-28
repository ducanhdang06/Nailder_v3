import { View, Text } from "react-native";
import { StyleSheet } from "react-native";

const CustomerChat = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Customer Chat</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize: 24,
      fontWeight: "bold",
    },
  });

export default CustomerChat;