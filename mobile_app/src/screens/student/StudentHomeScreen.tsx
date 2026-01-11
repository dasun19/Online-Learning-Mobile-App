import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, LayoutAnimation, Platform, UIManager, StyleSheet, RefreshControl } from 'react-native';
import { Button, Text, Card, useTheme } from "react-native-paper";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { AuthStackParamList } from "../../navigation/AuthStack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StudentTabParamList } from '../../navigation/StudentTabs';

type StudentHomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<{ Courses: undefined }>,
  NativeStackNavigationProp<StudentTabParamList>
>;

type Course = {
  _id: string;
  title: string;
  description: string;
  enrolledCount: number;
  instructor: string;
  isEnrolled: boolean;
};

const StudentHomeScreen: React.FC = () => {
  const navigation = useNavigation<StudentHomeNavigationProp>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string>("");
  const [expandedCourseIds, setExpandedCourseIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
  }

  const { user, token, loading } = useContext(AuthContext);
  const theme = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      if (!loading && token) {
        fetchCourses();
      }
    }, [loading, token])
  );

  useEffect(() => {
    if (!loading && token) {
      fetchCourses();
    }
  }, [loading, token]);

  const fetchCourses = async () => {
    const res = await API.get("/courses/for-students");
    setCourses(res.data);
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const res = await API.post(`/courses/${courseId}/enroll`);
      console.log("Enrolled successfully", res.data);
      fetchCourses();
    } catch (error: any) {
      console.log(error.response?.data?.message);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Network error. Please wait.");
      }
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  };

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const renderItem = ({ item }: { item: Course }) => {
    const isExpanded = expandedCourseIds.includes(item._id);

    return (
      <Card style={styles.card} elevation={1}>
        <Card.Content onTouchStart={() => !item.isEnrolled && toggleExpand(item._id)}>
          <Text variant="titleLarge" style={styles.courseTitle}>
            {item.title}
          </Text>

          <Text variant="bodyMedium" style={styles.instructor}>
            {item.instructor}
          </Text>

          <Text variant="bodySmall" style={styles.enrollment}>
            {item.enrolledCount !== 0
              ? `${item.enrolledCount} student${item.enrolledCount > 1 ? "s" : ""} enrolled`
              : "Be the first to enroll"}
          </Text>

          {!item.isEnrolled && isExpanded && (
            <Text variant="bodyMedium" style={styles.description}>
              {item.description}
            </Text>
          )}
        </Card.Content>

        <Card.Actions>
          <View style={styles.actions}>
            {!item.isEnrolled ? (
              <Button
                mode="contained"
                onPress={() => handleEnroll(item._id)}
              >
                Enroll
              </Button>
            ) : (
              <>
                <Button
                  mode="outlined"
                  disabled
                >
                  Enrolled
                </Button>
                <Button
                  mode="contained"
                  onPress={() =>
                    navigation.navigate("CourseDetails", {
                      courseId: item._id,
                      courseTitle: item.title,
                    })
                  }
                >
                  View Course
                </Button>
              </>
            )}
          </View>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Available Courses
      </Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]} // Android
            tintColor={theme.colors.primary} // iOS
          />
        }
      />

      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
    marginHorizontal: 16,
    marginTop: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  courseTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  instructor: {
    color: '#666',
    marginBottom: 6,
  },
  enrollment: {
    color: '#999',
    fontSize: 12,
  },
  description: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    lineHeight: 20,
  },
  enrollButton: {
    borderRadius: 8,
  },
  viewButton: {
    borderRadius: 8,
  },
  enrolledBadge: {
    borderRadius: 8,
  },
  enrolledLabel: {
    color: '#999',
  },
  error: {
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default StudentHomeScreen;