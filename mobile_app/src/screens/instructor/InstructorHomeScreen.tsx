import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, StyleSheet, Alert, RefreshControl, StatusBar } from 'react-native';
import { Button, Text, Card, useTheme, IconButton } from "react-native-paper";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InstructorTabParamList } from '../../navigation/InstructorTabs';
import { useNavigation } from '@react-navigation/native';

type InstructorHomeNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<{ MyCourses: undefined }>,
    NativeStackNavigationProp<InstructorTabParamList>
>;

type Course = {
    _id: string;
    title: string;
    description: string;
    enrolledCount: number;
};

const InstructorHomeScreen: React.FC = () => {
    const navigation = useNavigation<InstructorHomeNavigationProp>();
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string>("");
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const { user, token, loading } = useContext(AuthContext);
    const theme = useTheme();

    useEffect(() => {
        if (!loading && token) {
            fetchCourses();
        }
    }, [loading, token]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const fetchCourses = async () => {
        try {
            const res = await API.get("/courses/my-courses/list");
            setCourses(res.data);
        } catch (error: any) {
            console.log(error.response?.data?.message);
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Network error. Please wait.");
            }
        }
    };
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCourses();
        setRefreshing(false);
    };

    const handleDelete = async (courseId: string, courseTitle: string) => {
        Alert.alert(
            "Delete Course",
            `Are you sure you want to delete "${courseTitle}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await API.delete(`/courses/${courseId}`);
                            fetchCourses();
                        } catch (error: any) {
                            if (error.response) {
                                setError(error.response.data.message);
                            } else {
                                setError("Failed to delete course.");
                            }
                        }
                    },
                },
            ]
        );
    };


    const renderItem = ({ item }: { item: Course }) => {
        return (
            <Card style={styles.card} elevation={1}>
                <Card.Content>
                    <View style={styles.titleRow}>
                        <Text variant="titleLarge" style={styles.courseTitle}>
                            {item.title}
                        </Text>
                        <IconButton
                            icon="delete"
                            iconColor="#e74c3c"
                            size={20}
                            onPress={() => handleDelete(item._id, item.title)}
                        />
                    </View>

                    <Text variant="bodyMedium" style={styles.description}>
                        {item.description}
                    </Text>

                    <Text variant="bodySmall" style={styles.enrollment}>
                        {item.enrolledCount > 0
                            ? `${item.enrolledCount} student${item.enrolledCount > 1 ? "s" : ""} enrolled`
                            : "No students enrolled yet"}
                    </Text>
                </Card.Content>

                <Card.Actions>
                    <View style={styles.actions}>
                        <Button
                            mode="outlined"
                            onPress={() => navigation.navigate("EditCourse", {
                                courseId: item._id,
                                courseTitle: item.title
                            })}
                        >
                            Edit
                        </Button>
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate("CourseDetails", {
                                courseId: item._id,
                                courseTitle: item.title
                            })}
                        >
                            View Details
                        </Button>
                    </View>
                </Card.Actions>
            </Card>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <MaterialCommunityIcons name="book-off-outline" size={80} color="#ccc" />
            <Text variant="titleMedium" style={styles.emptyTitle}>
                No Courses Yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
                Click "Add Course" tab to create your first course
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#7c3aed" barStyle="light-content" />
            <View style={styles.topPage}>
                <Text variant="headlineMedium" style={styles.header}>
                    Teach Now
                </Text>
            </View>

            <FlatList
                data={courses}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]} // Android
                        tintColor={theme.colors.primary} // iOS
                    />
                }
            />

            {error ? (
                <Text style={[styles.error, { color: theme.colors.error }]}>
                    {error}
                </Text>
            ) : null}
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
    topPage: {
        backgroundColor: '#7c3aed',
        marginBottom: 10
    },
    header: {
        marginBottom: 20,
        marginHorizontal: 16,
        marginTop: 16,
        fontWeight: '600',
        color: "#ffff"

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
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    courseTitle: {
        fontWeight: '600',
        flex: 1,
    },
    description: {
        color: '#666',
        marginBottom: 8,
    },
    enrollment: {
        color: '#999',
        fontSize: 12,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontWeight: '600',
        marginTop: 16,
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

export default InstructorHomeScreen;