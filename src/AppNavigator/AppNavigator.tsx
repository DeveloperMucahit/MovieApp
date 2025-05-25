import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';

import LoginScreen from '../screens/LoginScreen/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';
import MovieListScreen from '../screens/HomeScreen/MovieListScreen';
import MovieDetailsScreen from '../screens/DetailScreen/MovieDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen/FavoritesScreen';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';

export type HomeStackParamList = {
  HomeMain: undefined;
  Details: { movieId: number };
};

export type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Search: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined; 
};

const Stack = createStackNavigator<RootStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#121212' },
        headerTintColor: '#ff8c00',
        cardStyle: { backgroundColor: '#121212' },
      }}
    >
      <HomeStack.Screen name="HomeMain" component={MovieListScreen} options={{ title: "Movie Library"}}/>
      <HomeStack.Screen name="Details" component={MovieDetailsScreen} options={{
        headerBackTitle: '',
        title: 'Movie Detail', // TODO: Açılan filmin adını dinamik olarak ayarla
    }} />
    </HomeStack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ff8c00',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#121212' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? "home" : "home-outline";
              break;
            case 'Favorites':
              iconName = focused ? "heart" : "heart-outline";
              break;
            case 'Search':
              iconName = focused ? "search" : "search-outline";
              break;
            case 'Profile':
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name = {iconName} size={size} color={color} />;
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
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#121212' },
        }}
      >
        {/* <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} /> */}
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
