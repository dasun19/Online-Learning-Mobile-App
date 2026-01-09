import React from 'react';
import { View, Text, FlatList } from 'react-native';

type Course = {
  id: string;
  title: string;
};

const courses: Course[] = [
  { id: '1', title: 'React Basics' },
  { id: '2', title: 'Node.js Fundamentals' },
];

const StudentHomeScreen: React.FC = () => {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Available Courses</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.title}</Text>}
      />
    </View>
  );
};

export default StudentHomeScreen;
