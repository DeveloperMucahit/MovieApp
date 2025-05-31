import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import themeStyles from "../../theme/theme";
import { auth } from "../../Firebase/FirebaseConfig";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useGlobalDispatch } from "../../Context/GlobalState";
import { TextInput } from "react-native-gesture-handler";

const ProfileScreen: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [credential, setCredential] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useGlobalDispatch();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Alert.alert("Success", "Logging out is successfully.");
    } catch (error) {
      Alert.alert("Error", "Something went wrong while logging out.");
      console.error("Error logging out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const user = auth.currentUser;

    if(!email || !password) {
      Alert.alert("Error", "Please enter your email and password to delete your account.");
      setIsDeleting(false);
      return;
    }

    const credential = EmailAuthProvider.credential(
      email,
      password
    );

    try {
      await reauthenticateWithCredential(user, credential);
      await user.delete();
      dispatch({ type: "SET_USER", payload: null });
      Alert.alert("Success", "Your account has been deleted successfully.");
    } catch (error: any) {
      Alert.alert("Error", "Something went wrong while deleting your account.");
      console.error("Error deleting account:", error);
    }
    setIsDeleting(false);
  };

  return (
    <SafeAreaView style={themeStyles.profilContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={themeStyles.profilTopButtonContainer}>
        <TouchableOpacity
          style={themeStyles.profilLogoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons
            name="exit-outline"
            size={22}
            color="#121212"
            style={themeStyles.profilIcon}
          />
          <Text style={themeStyles.profilLogoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={themeStyles.profilFlexSpacer} />
      
      <View style={themeStyles.profilInputContainer}>
        <TextInput
          style={themeStyles.profilInput}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={themeStyles.profilInput}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={themeStyles.profilBottomButtonContainer}>
        <TouchableOpacity
          style={themeStyles.profilDeleteButton}
          onPress={handleDeleteAccount}
          activeOpacity={0.7}
        >
          <Ionicons
            name="trash-outline"
            size={22}
            color="#fff"
            style={themeStyles.profilIcon}
          />
          <Text style={themeStyles.profilDeleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
