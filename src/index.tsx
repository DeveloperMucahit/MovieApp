import React from "react";
import { GlobalProvider } from "./Context/GlobalState";
import AppNavigator from "./AppNavigator/AppNavigator";
const App: React.FC = () => {
 

  return (
    <GlobalProvider>
      <AppNavigator />
    </GlobalProvider>
  );
};

export default App;
