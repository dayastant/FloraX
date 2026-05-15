import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#10b981",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e7eb",
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="farm"
        options={{
          title: "Farm",
          tabBarIcon: ({ color }) => <Feather name="map" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="zones"
        options={{
          title: "Zones",
          tabBarIcon: ({ color }) => <Feather name="grid" size={24} color={color} />,
          href: null, // Hide from tab bar, accessed via navigation only
        }}
      />
      <Tabs.Screen
        name="valves"
        options={{
          title: "Valves",
          tabBarIcon: ({ color }) => <Feather name="lock" size={24} color={color} />,
          href: null, // Hide from tab bar, accessed via navigation only
        }}
      />
      <Tabs.Screen
        name="irrigation"
        options={{
          title: "Irrigation",
          tabBarIcon: ({ color }) => <Feather name="droplet" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
