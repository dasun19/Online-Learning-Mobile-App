import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InstructorHomeScreen from '../screens/instructor/InstructorHomeScreen';
import AddCourseScreen from '../screens/instructor/AddCourseScreen';
import CourseDetailsScreen from '../screens/instructor/CourseDetailsScreen';
import EditCourseScreen from '../screens/instructor/EditCourseScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DrawerNavigator from "../navigation/DrawerNavigator";
import { StyleSheet, TouchableOpacity } from 'react-native';
import ProfileScreen from '../screens/common/ProfileScreen';
import { SettingsScreen } from '../screens/common/SettingsScreen';
import { HelpSupportScreen } from '../screens/common/HelpSupportScreen';

export type InstructorTabParamList = {
  TabNavigator: undefined;
  CourseDetails: {
    courseId: string;
    courseTitle: string;
  };
  EditCourse: {
    courseId: string;
    courseTitle: string;
  };
  Profile: undefined;
  Settings: undefined;
  HelpSupport: undefined;
};

type TabsParamList = {
  MyCourses: undefined;
  AddCourse: undefined;
}

const Tab = createBottomTabNavigator<TabsParamList>();
const Stack = createNativeStackNavigator<InstructorTabParamList>();

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
          name="MyCourses"
          component={InstructorHomeScreen}
          options={{
            tabBarLabel: 'My Courses',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="book-education"
                size={25}
                color={color}
                style={{ marginTop: 4 }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="AddCourse"
          component={AddCourseScreen}
          options={{
            tabBarLabel: 'Add Course',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="plus-circle"
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

const InstructorTabs = () => {
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
          headerStyle: {
            backgroundColor: '#7c3aed',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        })}
      />
      <Stack.Screen
        name="EditCourse"
        component={EditCourseScreen}
        options={({ route }) => ({
          title: 'Edit Course',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#7c3aed',
          },
          headerTintColor: '#fff',
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

export default InstructorTabs;