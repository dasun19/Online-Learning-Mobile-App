import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentHomeScreen from '../screens/student/StudentHomeScreen';
import EnrolledCoursesScreen from '../screens/student/EnrolledCoursesScreen';
import CourseCardScreen from '../components/CourseCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type StudentTabParamList = {
  TabNavigator: undefined;
  CourseCard: {
    courseId: string;
    courseTitle: string;
  };
};

type TabsParamList = {
  Courses: undefined;
  MyCourses: undefined;
}

const Tab = createBottomTabNavigator<TabsParamList>();
const Stack = createNativeStackNavigator<StudentTabParamList>()

const TabNavigator = () => {
  return (
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
        name="CourseCard"
        component={CourseCardScreen}
        options={({ route }) => ({
          title: route.params.courseTitle,
          headerShown: false,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        })}
      />
    </Stack.Navigator>
  );
};

export default StudentTabs;
