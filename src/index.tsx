import React, { useEffect } from "react";
import { GlobalProvider } from "./Context/GlobalState";
import AppNavigator from "./AppNavigator/AppNavigator";
import { auth } from "./Firebase/FirebaseConfig";
import { ActivityIndicator, View } from "react-native";

const App: React.FC = () => {
 

  return (
    <GlobalProvider>
      <AppNavigator />
    </GlobalProvider>
  );
};

export default App;
