import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentHomeScreen from '../screens/student/StudentHomeScreen';
import EnrolledCoursesScreen from '../screens/student/EnrolledCoursesScreen';
import CourseDetailsScreen from '../screens/student/CourseDetailsScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DrawerNavigator from "../navigation/DrawerNavigator";
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ProfileScreen from '../screens/common/ProfileScreen';
import { SettingsScreen } from '../screens/common/SettingsScreen';
import { HelpSupportScreen } from '../screens/common/HelpSupportScreen';

export type StudentTabParamList = {
  TabNavigator: undefined;
  CourseDetails: {
    courseId: string;
    courseTitle: string;
  };
  Profile: undefined;
  Settings: undefined;
  HelpSupport: undefined;
};

type TabsParamList = {
  Courses: undefined;
  MyCourses: undefined;
}

const Tab = createBottomTabNavigator<TabsParamList>();
const Stack = createNativeStackNavigator<StudentTabParamList>()

const TabNavigator = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#7c3aed',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 0,
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            borderTopColor: '#e5e7eb',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarItemStyle: {
            paddingVertical: 2,
          },
        })}
      >
        <Tab.Screen
          name="Courses"
          component={StudentHomeScreen}
          options={{
            tabBarLabel: 'Courses',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="book-multiple"
                size={25}
                color={color}
                style={{ marginTop: 4 }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="MyCourses"
          component={EnrolledCoursesScreen}
          options={{
            tabBarLabel: 'Enrolled Courses',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="check-circle"
                size={25}
                color={color}
                style={{ marginTop: 4 }}
              />
            ),
          }}
        />
      </Tab.Navigator>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setDrawerVisible(true)}
      >
        <MaterialCommunityIcons name="menu" size={28} color="#fff" />
      </TouchableOpacity>

      <DrawerNavigator
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </>
  );
};

const StudentTabs = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CourseDetails"
        component={CourseDetailsScreen}
        options={({ route }) => ({
          title: route.params.courseTitle,
          headerShown: true,
          headerTintColor: '#fff',
          headerStyle: { backgroundColor: '#7c3aed' },
          headerTitleStyle: {
            fontWeight: '600',
          },
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: 'Profile',
          headerStyle: { backgroundColor: '#7c3aed' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: 'Settings',
          headerStyle: { backgroundColor: '#7c3aed' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{
          headerShown: true,
          title: 'Help & Support',
          headerStyle: { backgroundColor: '#7c3aed' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    top: 10,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default StudentTabs;
