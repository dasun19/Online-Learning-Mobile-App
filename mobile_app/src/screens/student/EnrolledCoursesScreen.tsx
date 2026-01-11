import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Text, Card, useTheme } from "react-native-paper";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StudentTabParamList } from "../../navigation/StudentTabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

type EnrolledCoursesNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<{ MyCourses: undefined }>,
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

const EnrolledCoursesScreen: React.FC = () => {
    const navigation = useNavigation<EnrolledCoursesNavigationProp>();
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string>("");

    const { user, token, loading } = useContext(AuthContext);
    const theme = useTheme();

    useFocusEffect(
        React.useCallback(() => {
            if (!loading && token) {
                fetchEnrolledCourses();
            }
        }, [loading, token])
    );

    useEffect(() => {
        if (!loading && token) {
            fetchEnrolledCourses();
        }
    }, [loading, token]);

    const fetchEnrolledCourses = async () => {
        try {
            const res = await API.get("/courses/for-students");
            // Filter only enrolled courses
            const enrolledCourses = res.data.filter((course: Course) => course.isEnrolled);
            setCourses(enrolledCourses);
        } catch (error: any) {
            console.log(error.response?.data?.message);
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Network error. Please wait.");
            }
        }
    };

    const renderItem = ({ item }: { item: Course }) => {
        return (
            <Card style={styles.card} elevation={1}>
                <Card.Content>
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
                </Card.Content>

                <Card.Actions>
                    <View style={styles.actions}>
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
                    </View>
                </Card.Actions>
            </Card>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text variant="titleMedium" style={styles.emptyTitle}>
                No Enrolled Courses
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
                You haven't enrolled in any courses yet.
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.header}>
                My Enrolled Courses
            </Text>

            <FlatList
                data={courses}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
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
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontWeight: '600',
        marginBottom: 8,
        color: '#666',
    },
    emptyText: {
        color: '#999',
        textAlign: 'center',
    },
    error: {
        marginTop: 12,
        marginHorizontal: 16,
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default EnrolledCoursesScreen;