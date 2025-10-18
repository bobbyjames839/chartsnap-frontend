import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthNavigator from './app/AuthNavigator';
import TabNavigator from './app/TabNavigator';
import { View, ActivityIndicator } from 'react-native';
import { colors } from './styles/colors';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.light} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
