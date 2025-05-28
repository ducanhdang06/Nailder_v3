import { View, Text } from "react-native";
import { StyleSheet } from "react-native";

const CustomerSaved = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Customer Saved</Text>
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

export default CustomerSaved;