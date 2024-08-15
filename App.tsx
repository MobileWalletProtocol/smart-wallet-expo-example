// Pre-requisite 1. Polyfill
import "./src/polyfill";

import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { handleResponse } from "@mobile-wallet-protocol/client";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome6 } from "@expo/vector-icons";

import EIP1193Demo from "./src/eip1193Demo";
import WagmiDemo, { config } from "./src/wagmiDemo";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

const Tab = createBottomTabNavigator();

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
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={() => ({
                tabBarIcon: ({ color, size }) => {
                  return <FontAwesome6 name={'ethereum'} size={size} color={color} />;
                },
                tabBarActiveTintColor: "black",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
              })}
            >
              <Tab.Screen name="EIP-1193" component={EIP1193Demo} />
              <Tab.Screen name="Wagmi" component={WagmiDemo} />
            </Tab.Navigator>
          </NavigationContainer>
        </QueryClientProvider>
      </WagmiProvider>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
