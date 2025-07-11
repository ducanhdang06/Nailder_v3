import "react-native-get-random-values";
import "./src/aws/setup";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";
import { UserProvider } from "./src/context/userContext";
import client from "./src/graphql/apolloClient";
import { ApolloProvider } from "@apollo/client";
import { TechnicianProfileProvider } from "./src/context/technicianProfileContext";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <TechnicianProfileProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <AppNavigator />
          </GestureHandlerRootView>
        </TechnicianProfileProvider>
      </UserProvider>
    </ApolloProvider>
  );
}
