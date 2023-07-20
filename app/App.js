import React from "react";

import { AuthProvider } from "./src/Context/AuthContext";
import AppNav from "./src/navigation/AppNav";

const App = () => {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
};

export default App;
