import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, Animated, StyleSheet, Text, StatusBar } from 'react-native';
import { useState, useRef } from 'react';
import { Feather, AntDesign } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import HomeScreen from './tabs/HomeScreen';
import TradingScreen from './tabs/TradingScreen';
import ProfileScreen from './tabs/ProfileScreen';
import SettingsScreen from './tabs/SettingsScreen';
import AnalysisScreen from './tabs/AnalysisScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Screens Component
function TabScreens() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { display: 'none' },
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trading" component={TradingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function NavigatorWithSidebar() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-250)).current;

  const toggleSidebar = () => {
    const toValue = sidebarVisible ? -250 : 0;
    Animated.timing(sidebarAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Main Content */}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen name="MainTabs" component={TabScreens} />
        <Stack.Screen 
          name="Analysis" 
          component={AnalysisScreen}
          options={{
            presentation: 'card',
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        />
      </Stack.Navigator>

      {/* Hamburger Menu Button - Position Absolute */}
      <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
        <Feather name="menu" size={28} color={colors.lightest} />
      </TouchableOpacity>

      {/* Sidebar */}
      <Animated.View 
        style={[
          styles.sidebar, 
          { transform: [{ translateX: sidebarAnim }] }
        ]}
      >
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Menu</Text>
          <TouchableOpacity onPress={toggleSidebar}>
            <AntDesign name="close" size={24} color={colors.lightest} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sidebarItem}>
          <Feather name="home" size={20} color={colors.light} />
          <Text style={styles.sidebarItemText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sidebarItem}>
          <Feather name="trending-up" size={20} color={colors.light} />
          <Text style={styles.sidebarItemText}>Trading</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sidebarItem}>
          <Feather name="user" size={20} color={colors.light} />
          <Text style={styles.sidebarItemText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sidebarItem}>
          <Feather name="settings" size={20} color={colors.light} />
          <Text style={styles.sidebarItemText}>Settings</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Sidebar Overlay */}
      {sidebarVisible && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={toggleSidebar}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  menuButton: {
    position: 'absolute',
    top: 60,
    left: 15,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 998,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: colors.darker,
    borderRightWidth: 1,
    borderRightColor: colors.dark,
    paddingTop: 60,
    zIndex: 1000,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark,
    marginBottom: 20,
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.lightest,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  sidebarItemText: {
    fontSize: 16,
    color: colors.lightest,
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
});

export default function TabNavigator() {
  return <NavigatorWithSidebar />;
}
