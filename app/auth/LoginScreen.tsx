import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image, Alert, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '89528714259-pso1lejb8ask8o4b3luiebkfv2nj8f74.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@bobbydavidson/trading',
      extraParams: { prompt: 'select_account' }, // <—

  });

  useEffect(() => {
    if (!response) return;
    if (response.type === 'success') {
      const idToken = response.params?.id_token;
      handleGoogleSignInSuccess(idToken);
    } else if (response.type === 'error') {
      console.error('Google OAuth error:', response.error);
      Alert.alert('Error', 'Google sign-in failed. Please try again.');
    }
  }, [response]);

  const handleGoogleSignInSuccess = async (idToken?: string) => {
    try {
      if (!idToken) {
        Alert.alert('Error', 'No ID token received from Google');
        return;
      }
      setIsLoading(true);

      const API_BASE_URL = 'http://localhost:3000/api'; // unchanged
      const apiResponse = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await apiResponse.json();

      if (data?.success) {
        await signIn(idToken, 'google');
        Alert.alert('Success', `Welcome ${data.user?.name || data.user?.email || 'back'}!`);
      } else {
        console.error('Backend auth error:', data);
        Alert.alert('Error', data?.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      Alert.alert('Error', 'Failed to connect to backend. Make sure the server is running and reachable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (!request) {
        Alert.alert('Please wait', 'Google Sign-In is still initializing.');
        return;
      }
      await promptAsync(); // no options needed now
    } catch (err) {
      console.error('Error launching Google Sign-In:', err);
      Alert.alert('Error', 'Failed to launch Google Sign-In');
    }
  };

  const handleAppleSignIn = async () => {
    Alert.alert(
      'Demo Mode',
      'Apple Sign-In needs proper configuration. Use Demo Login instead?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Demo Login',
          onPress: async () => {
            const mockUser = {
              uid: 'demo-user-' + Date.now(),
              email: 'demo@example.com',
              name: 'Demo User',
              provider: 'apple',
            };
            await AsyncStorage.setItem('isAuthenticated', 'true');
            await AsyncStorage.setItem('userData', JSON.stringify(mockUser));
            await signIn('mock-token', 'apple');
            Alert.alert('Success', 'Signed in as Demo User!');
          },
        },
      ]
    );
  };

  const isGoogleDisabled = useMemo(() => isLoading || !request, [isLoading, request]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topSection}>
        <Text style={styles.title}>ChartSnap AI</Text>
        <Text style={styles.subtitle}>Snap a chart, Get a verdict.</Text>
      </View>

      <View style={styles.middleSection}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/home.png')} style={styles.logo} resizeMode="cover" />
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.appleButton} onPress={handleAppleSignIn} disabled={isLoading}>
          <AntDesign name="apple" size={22} color={colors.darkest} style={{ marginRight: 8 }} />
          <Text style={styles.appleButtonText}>{isLoading ? 'Please wait...' : 'Continue with Apple'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.googleButton, isGoogleDisabled && { opacity: 0.6 }]}
          onPress={handleGoogleSignIn}
          disabled={isGoogleDisabled}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              <AntDesign name="google" size={22} color={colors.light} style={{ marginRight: 8 }} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing you agree to <Text style={styles.termsLink}>Terms & Privacy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topSection: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 24, marginBottom: 20 },
  middleSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomSection: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 24, paddingBottom: 60 },
  logoContainer: { width: '90%', borderRadius: 30, overflow: 'hidden' },
  logo: { width: '100%', height: '100%' },
  title: { fontSize: 52, fontWeight: '700', color: colors.lightest, marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 20, color: colors.lighter, fontWeight: '400' },
  appleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lightest, paddingVertical: 20, borderRadius: 24, marginBottom: 16 },
  appleButtonText: { fontSize: 18, fontWeight: '600', color: colors.darkest },
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.darker, paddingVertical: 20, borderRadius: 24, borderWidth: 1, borderColor: colors.dark, marginBottom: 24 },
  googleButtonText: { fontSize: 18, fontWeight: '600', color: colors.lightest },
  termsText: { fontSize: 13, color: colors.lighter, textAlign: 'center' },
  termsLink: { color: colors.light, textDecorationLine: 'underline' },
});
