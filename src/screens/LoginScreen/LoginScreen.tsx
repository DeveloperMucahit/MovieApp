import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { auth } from "../../Firebase/FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "../../AppNavigator/AppNavigator"; // or wherever your stack params are defined
import themeStyles from "../../theme/theme";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<HomeStackParamList, "Login">>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    if (!email.includes("@") && !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!email || !password) {
      setError("Fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      console.log("Login successful:", result);
      if (!result) {
        setError("Login failed. Please check your credentials.");
        return;
      }
    } catch (err: any) {
      console.error(err);

      switch (err.code) {
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/invalid-credential":
          setError("Invalid credentials provided.");
          break;
        case "auth/user-not-found":
          setError("No user found with this email.");
          break;  
        case "auth/wrong-password":
          setError("Invalid Email or Password.");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled.");
          break;
        default:
          setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#121212" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={themeStyles.registerContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#121212" />
            <View style={themeStyles.registerContent}>
              <Text style={themeStyles.registerTitle}>Login</Text>
              <TextInput
                style={themeStyles.registerInput}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
              <TextInput
                style={themeStyles.registerInput}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              {error && <Text style={themeStyles.loginErrorText}>{error}</Text>}
              <TouchableOpacity
                style={themeStyles.registerButton}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#121212" />
                ) : (
                  <Text style={themeStyles.registerButtonText}>Login</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={themeStyles.registerLoginContainer}>
              <Text style={themeStyles.registerLoginText}>
                Don't have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                activeOpacity={0.7}
              >
                <Text style={themeStyles.registerLoginButtonText}>
                  {" "}
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
