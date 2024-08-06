// 1. Polyfill
import "./src/polyfill";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { useEffect } from "react";

// exp://x.x.x.x:8000/--/
const PREFIX_URL = Linking.createURL("/");

export default function App() {
  // 2. Setup deeplinking
  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("incoming deeplink:", url);
      try {
        // handleResponse(url);
      } catch (err) {
        console.error(err);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
