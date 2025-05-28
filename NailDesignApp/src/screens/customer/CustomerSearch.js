import { View, Text } from "react-native";
import { StyleSheet } from "react-native";

const CustomerSearch = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Customer Search</Text>
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

export default CustomerSearch;