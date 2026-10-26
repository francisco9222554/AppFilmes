import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1e88e5" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Filmes" }} />
      <Stack.Screen name="cadastro" options={{ title: "Cadastrar Filme" }} />
    </Stack>
  );
}