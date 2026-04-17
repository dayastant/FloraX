import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to the login page automatically when opening the app
  return <Redirect href={"/(auth)/login" as any} />;
}
