import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@react-native-vector-icons/ionicons";

import LoginScreen from "../Screens/LoginScreen/LoginScreen";
import RegisterScreen from "../Screens/RegisterScreen/RegisterScreen";
import MovieListScreen from "../Screens/HomeScreen/MovieListScreen";
import MovieDetailsScreen from "../Screens/DetailScreen/MovieDetailsScreen";
import FavoritesScreen from "../Screens/FavoritesScreen/FavoritesScreen";
import SearchScreen from "../Screens/SearchScreen/SearchScreen";
import ProfileScreen from "../Screens/ProfileScreen/ProfileScreen";
import { auth } from "../Firebase/FirebaseConfig";

export type HomeStackParamList = {
  HomeMain: undefined;
  Details: { movieId: number };
  Login: undefined;
  Register: undefined;
};

export type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Search: undefined;
  Profile: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#121212" },
        headerTintColor: "#ff8c00",
        cardStyle: { backgroundColor: "#121212" },
      }}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={MovieListScreen}
        options={{ headerShown: true, title: "Movie Library" }}
      />
      <HomeStack.Screen
        name="Details"
        component={MovieDetailsScreen}
        options={{
          headerShown: true,
          headerBackTitle: "",
        }}
      />
    </HomeStack.Navigator>
  );
}

function MainTabNavigator({ onLogout }: { onLogout?: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#ff8c00",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: { backgroundColor: "#121212" },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Favorites":
              iconName = focused ? "heart" : "heart-outline";
              break;
            case "Search":
              iconName = focused ? "search" : "search-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  const [user, setUser] = React.useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe; 
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <NavigationContainer>
      {user ? (
        <HomeStack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: "#121212" },
          }}
        >
          <HomeStack.Screen name="HomeMain" component={MainTabNavigator} />
        </HomeStack.Navigator>
      ) : (
        <HomeStack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: "#121212" },
          }}
        >
          <HomeStack.Screen name="Login" component={LoginScreen} />
          <HomeStack.Screen name="Register" component={RegisterScreen} />
        </HomeStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
