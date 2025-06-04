import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@react-native-vector-icons/ionicons";

import LoginScreen from "../screens/LoginScreen/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen/RegisterScreen";
import MovieListScreen from "../screens/HomeScreen/MovieListScreen";
import MovieDetailsScreen from "../screens/DetailScreen/MovieDetailsScreen";
import FavoritesScreen from "../screens/FavoritesScreen/FavoritesScreen";
import SearchScreen from "../screens/SearchScreen/SearchScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import { auth } from "../Firebase/FirebaseConfig";
import { Platform, StatusBar } from "react-native";

const headerHeight = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 44;

export type HomeStackParamList = {
  HomeMain: undefined;
  Details: { movieId: number };
  Login: undefined;
  Register: undefined;
  Search: undefined;
};

export type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Search: undefined;
  Profile: undefined;
  Details: { movieId: number };
};

export type SearchStackParamList = {
  Search: undefined;
  Details: { movieId: number };
};

export type FavoriteStackParamList = {
  Favorites: undefined;
  Details: { movieId: number };
};

const HomeStack = createStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const SearchStack = createStackNavigator<SearchStackParamList>();
const FavoritesStack = createStackNavigator<FavoriteStackParamList>();


function SearchStackNavigator() {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#121212",
        },
        headerTintColor: "#ff8c00",
        headerTitleAlign: "center",
        cardStyle: { backgroundColor: "#121212" },
      }}
    >
      <SearchStack.Screen name="Search" component={SearchScreen} />
      <SearchStack.Screen
        name="Details"
        component={MovieDetailsScreen}
        options={{
          headerShown: true,
          headerBackTitle: "",
        }}
      />
    </SearchStack.Navigator>
  );
}

function FavoritesStackNavigator() {
  return (
    <FavoritesStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#121212",
        },
        headerTintColor: "#ff8c00",
        headerTitleAlign: "center",
        cardStyle: { backgroundColor: "#121212" },
      }}
    >
      <FavoritesStack.Screen name="Favorites" component={FavoritesScreen} />
      <FavoritesStack.Screen
        name="Details"
        component={MovieDetailsScreen}
        options={{
          headerShown: true,
          headerBackTitle: "",
        }}
      />
    </FavoritesStack.Navigator>
  );
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { 
          backgroundColor: "#121212",
         },
        headerTintColor: "#ff8c00",
        headerTitleAlign: "center",
      }}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={MovieListScreen}
        options={{ title: "Movie Library" }}
      />
      <HomeStack.Screen
        name="Details"
        component={MovieDetailsScreen}
        options={{
          headerBackTitle: "",
        }}
      />
    </HomeStack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#ff8c00",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: { backgroundColor: "#121212", },
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
      <Tab.Screen name="Favorites" component={FavoritesStackNavigator} />
      <Tab.Screen name="Search" component={SearchStackNavigator} />
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
        <MainTabNavigator />
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
