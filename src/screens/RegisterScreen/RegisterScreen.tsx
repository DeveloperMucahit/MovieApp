import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "../../AppNavigator/AppNavigator";
import { auth, db } from "../../Firebase/FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import themeStyles from "../../theme/theme";

const RegisterScreen: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<HomeStackParamList, "Register">>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    if (!email || !password) {
      setError("Fill in all fields.");
      return;
    }
    if (!email.includes("@") && !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert("Success", "User registered successfully.");
      navigation.navigate("Login");
    } catch (err: any) {
      console.error(err);
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already in use.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/weak-password":
          setError("Password must be at least 6 characters long.");
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
              <Text style={themeStyles.registerTitle}>Register</Text>
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
              {error && (
                <Text style={themeStyles.registerErrorText}>{error}</Text>
              )}
              <TouchableOpacity
                style={themeStyles.registerButton}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#121212" />
                ) : (
                  <Text style={themeStyles.registerButtonText}>Register</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={themeStyles.registerLoginContainer}>
              <Text style={themeStyles.registerLoginText}>
                Already have an account,
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                activeOpacity={0.7}
              >
                <Text style={themeStyles.registerLoginButtonText}>
                  {" "}
                  Login in!
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
