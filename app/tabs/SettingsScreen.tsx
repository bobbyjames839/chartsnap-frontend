import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../styles/colors';

export default function SettingsScreen() {
  const { signOutUser, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      Alert.alert('Success', 'Successfully signed out');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>
      
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userText}>Signed in as:</Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </View>
      )}
      
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.lightest,
    marginBottom: 40,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  userText: {
    fontSize: 16,
    color: colors.lighter,
    marginBottom: 8,
  },
  emailText: {
    fontSize: 18,
    color: colors.light,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: colors.darker,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark,
  },
  signOutText: {
    color: colors.lightest,
    fontSize: 16,
    fontWeight: '600',
  },
});
