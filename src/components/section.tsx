import { memo, useCallback, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Button from "./button";

type SectionProps = {
  title: string;
  onPress: () => Promise<string | void> | string | void;
  buttonLabel?: string;
};

function Section(props: SectionProps) {
  const [result, setResult] = useState<string | Error | null>(null);

  const handlePress = useCallback(async () => {
    try {
      const res = await props.onPress();
      if (res) setResult(res);
    } catch (err) {
      if (err instanceof Error) setResult(err);
    }
  }, [props.onPress]);

  const renderResult = useCallback(() => {
    const isError = result instanceof Error;
    return (
      <View
        style={[
          styles.resultContainer,
          {
            backgroundColor: isError ? "#ff000012" : "#00000008",
          },
        ]}
      >
        <Text
          style={{
            fontFamily: Platform.select({
              ios: "Courier",
              default: "monospace",
            }),
            color: isError ? "#ff0000" : "#000000",
          }}
        >
          {result instanceof Error ? result.message : result}
        </Text>
      </View>
    );
  }, [result]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 18, fontWeight: 500 }}>{props.title}</Text>
        <Button title={props.buttonLabel || "Submit"} onPress={handlePress} />
      </View>
      {result && renderResult()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: "#00000012",
    borderRadius: 16,
    borderWidth: 1,
    padding: 8,
    flexDirection: "column",
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultContainer: {
    backgroundColor: "#00000008",
    borderRadius: 8,
    padding: 8,
  },
});

export default memo(Section);
