import React from "react";
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
import { deleteUser} from "firebase/auth";

const ProfileScreen: React.FC = () => {
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure to logout your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await auth.signOut();
              Alert.alert("Success", "Logging out is successfully.");
            } catch (error) {
              Alert.alert("Error", "Something went wrong while logging out.");
              console.error("Error logging out:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
    }

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {
                await deleteUser(user);
                Alert.alert("Success", "The Account has been deleted.");
              }
            } catch (error) {
              Alert.alert("Failed", "The Account could not be deleted.");
            }
          },
          style: "destructive",
        },
      ]
    );
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
