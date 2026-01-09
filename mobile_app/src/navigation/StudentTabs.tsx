import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudentHomeScreen from '../screens/student/StudentHomeScreen';
//import EnrolledCoursesScreen from '../screens/student/EnrolledCoursesScreen';

export type StudentTabParamList = {
  Courses: undefined;
  MyCourses: undefined;
};

const Tab = createBottomTabNavigator<StudentTabParamList>();

const StudentTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Courses" component={StudentHomeScreen} />
      {/* <Tab.Screen name="MyCourses" component={EnrolledCoursesScreen} /> */}
    </Tab.Navigator>
  );
};

export default StudentTabs;
