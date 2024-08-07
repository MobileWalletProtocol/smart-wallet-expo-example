import * as Linking from "expo-linking";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CoinbaseWalletSDK from "@mobile-wallet-protocol/client";
import Section from "./components/section";

// exp://x.x.x.x:8000/--/
const PREFIX_URL = Linking.createURL("/");

// Step 1. Initialize SDK and create provider
const sdk = new CoinbaseWalletSDK({
  appName: "SCW Expo Example",
  appChainIds: [8453],
  appDeeplinkUrl: PREFIX_URL,
});
const provider = sdk.makeWeb3Provider();

export default function Home() {
  const insets = useSafeAreaInsets();
  const [addresses, setAddresses] = useState<string[]>([]);
  const isConnected = addresses.length > 0;
  useEffect(() => {
    provider.addListener("accountsChanged", (accounts) => {
      if (accounts && Array.isArray(accounts)) setAddresses(accounts);
    });

    provider.addListener("disconnect", () => {
      setAddresses([]);
    });

    () => {
      provider.removeListener("accountsChanged");
      provider.removeListener("disconnect");
    };
  }, []);

  // Step 2: start requesting using provider
  const handleConnect = useCallback(async () => {
    const result = await provider.request({ method: "eth_requestAccounts" });
    if (result && Array.isArray(result)) {
      setAddresses(result as string[]);
    }
    return stringify(result);
  }, []);

  const handleAccounts = useCallback(async () => {
    const result = await provider.request({ method: "eth_accounts" });
    return stringify(result);
  }, []);

  const handlePersonalSign = useCallback(async () => {
    const result = await provider.request({
      method: "personal_sign",
      params: ["0x48656c6c6f2c20776f726c6421", addresses[0]],
    });
    return stringify(result);
  }, [addresses]);

  const handleWalletGetCapabilities = useCallback(async () => {
    const result = await provider.request({ method: "wallet_getCapabilities" });
    return stringify(result);
  }, []);

  const handleDisconnect = useCallback(async () => {
    await provider.disconnect();
  }, []);

  const contentContainerStyle = useMemo(
    () => ({
      paddingTop: insets.top + 16,
      paddingBottom: insets.bottom + 16,
      paddingLeft: insets.left + 16,
      paddingRight: insets.right + 16,
      gap: 16,
    }),
    [insets]
  );
  const [connectPatch, setConnectPatch] = useState<number>(0);
  const handleDisconnectPatched = useCallback(async () => {
    await handleDisconnect();
    setConnectPatch((prev) => prev + 1);
  }, []);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={contentContainerStyle}
    >
      <Text style={{ fontSize: 24, fontWeight: "600", textAlign: "center" }}>
        {"Smart Wallet 🤝 Expo"}
      </Text>
      {isConnected && (
        <Text style={{ fontSize: 16, fontWeight: "600", textAlign: "center" }}>
          Connected ✅
        </Text>
      )}
      <Section
        key={`connect${connectPatch}`}
        title="eth_requestAccounts"
        buttonLabel="Connect"
        onPress={handleConnect}
      />
      {isConnected && (
        <>
          <Section
            key="disconnect"
            title="@disconnect"
            buttonLabel="Disconnect"
            onPress={handleDisconnectPatched}
          />
          <Section
            key="accounts"
            title="eth_accounts"
            onPress={handleAccounts}
          />
          <Section
            key="personal_sign"
            title="personal_sign"
            onPress={handlePersonalSign}
          />
          <Section
            key="wallet_getCapabilities"
            title="wallet_getCapabilities"
            onPress={handleWalletGetCapabilities}
          />
        </>
      )}
    </ScrollView>
  );
}

function stringify(result: unknown): string {
  if (typeof result === "string") {
    return result;
  }
  return JSON.stringify(result, null, 2);
}

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
  },
});
