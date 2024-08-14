// Pre-requisite 1. Polyfill
import "./src/polyfill";

import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { handleResponse } from "@mobile-wallet-protocol/client";

import EIP1193Demo from "./src/eip1193Demo";
import WagmiDemo, { config } from "./src/wagmiDemo";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from "wagmi";

const queryClient = new QueryClient()

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
      {/* <EIP1193Demo /> */}
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <WagmiDemo />
        </QueryClientProvider>
      </WagmiProvider>
      <StatusBar style='dark' />
    </SafeAreaProvider>
  );
}
