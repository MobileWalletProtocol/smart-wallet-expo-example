// Pre-requisite 1. Polyfill
import "./src/polyfill";

import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { handleResponse } from "@mobile-wallet-protocol/client/dist/core/communicator/handleResponse.native";

import Home from "./src/home";

export default function App() {
  // Pre-requisite 2. Setup deeplinking handling
  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("incoming deeplink:", url);
      try {
        handleResponse(url);
      } catch (err) {
        console.error(err);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <Home />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
