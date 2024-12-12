polyfillForWagmi();

import { useMemo } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Section from "./components/section";
import {
  createConnectorFromWallet,
  Wallets,
} from "@mobile-wallet-protocol/wagmi-connectors";
import * as Linking from "expo-linking";
import {
  http,
  createConfig,
  useAccount,
  useConnect,
  useSignMessage,
  useDisconnect,
} from "wagmi";
import { base } from "wagmi/chains";
import { useCapabilities } from "wagmi/experimental";

const PREFIX_URL = Linking.createURL("/");

export const config = createConfig({
  chains: [base],
  connectors: [
    createConnectorFromWallet({
      metadata: {
        name: "Wagmi Demo",
        customScheme: PREFIX_URL,
      },
      wallet: Wallets.CoinbaseSmartWallet,
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

export default function WagmiDemo() {
  const insets = useSafeAreaInsets();
  const { address } = useAccount();

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const {
    data: signMessageHash,
    error: signMessageError,
    signMessage,
    reset,
  } = useSignMessage();

  const { data: capabilities, error: capabilitiesError } = useCapabilities();

  const contentContainerStyle = useMemo(
    () => ({
      paddingTop: insets.top + 16,
      paddingBottom: insets.bottom + 16,
      paddingLeft: insets.left + 16,
      paddingRight: insets.right + 16,
      gap: 16,
    }),
    [insets],
  );

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={contentContainerStyle}
    >
      <Text style={{ fontSize: 24, fontWeight: "600", textAlign: "center" }}>
        {"Smart Wallet Wagmi Demo"}
      </Text>
      {address && (
        <Text style={{ fontSize: 16, fontWeight: "600", textAlign: "center" }}>
          Connected ✅
        </Text>
      )}
      <Section
        key={`connect`}
        title="useConnect"
        result={address}
        buttonLabel="Connect"
        onPress={() => connect({ connector: connectors[0] })}
      />
      {address && (
        <>
          <Section
            key="useDisconnect"
            title="useDisconnect"
            buttonLabel="Disconnect"
            onPress={() => {
              disconnect({ connector: connectors[0] });
              reset();
            }}
          />
          <Section
            key="useSignMessage"
            title="useSignMessage"
            result={signMessageHash ?? signMessageError}
            onPress={() => signMessage({ message: "hello world" })}
          />
          <Section
            key="useCapabilities"
            title="useCapabilities"
            result={JSON.stringify(capabilities ?? capabilitiesError, null, 2)}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
  },
});

function polyfillForWagmi() {
  const noop = (() => {}) as any;

  window.addEventListener = noop;
  window.dispatchEvent = noop;
  window.removeEventListener = noop;
  window.CustomEvent = function CustomEvent() {
    return {};
  } as any;
}
