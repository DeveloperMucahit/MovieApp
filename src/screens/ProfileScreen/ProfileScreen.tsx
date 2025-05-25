import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const ProfileScreen: React.FC = () => {
  const handleLogout = () => {
    // Placeholder: handle logout logic here
    console.log('Logout pressed');
  };

  const handleDeleteAccount = () => {
    // Placeholder: handle delete account logic here
    console.log('Delete Account pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.topButtonContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons
            name="exit-outline"
            size={22}
            color="#121212"
            style={styles.icon}
          />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.flexSpacer} />

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
          activeOpacity={0.7}
        >
          <Ionicons
            name="trash-outline"
            size={22}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  topButtonContainer: {
    paddingTop: 10,
  },
  bottomButtonContainer: {
    paddingBottom: 20,
  },
  flexSpacer: {
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ff8c00',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#121212',
    fontSize: 18,
    fontWeight: '700',
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#ff4d4d',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  icon: {
    marginRight: 10,
  },
});

export default ProfileScreen;
