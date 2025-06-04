import React from "react";
import { GlobalProvider } from "./context/GlobalState";
import AppNavigator from "./AppNavigator/AppNavigator";
import {
  SafeAreaView,
} from "react-native-safe-area-context";

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <GlobalProvider>
        <AppNavigator />
      </GlobalProvider>
    </SafeAreaView>
  );
};

export default App;
