import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Text, useTheme, ActivityIndicator, Card } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import API from "../../api/axios";
import { StudentTabParamList } from "../../navigation/StudentTabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<StudentTabParamList, "CourseDetails">;

type ContentItem = {
    _id: string;
    title: string;
    body: string;
};

type CourseDetail = {
    _id: string;
    title: string;
    content: ContentItem[];
    instructor: string;
};

const CourseDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
    const { courseId, courseTitle } = route.params;
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [unenrolling, setUnenrolling] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        fetchCourse();
    }, []);

    const fetchCourse = async () => {
        try {
            const res = await API.get(`/courses/${courseId}`);
            setCourse(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const handleUnenroll = () => {
        Alert.alert(
            "Unenroll from Course",
            `Are you sure you want to unenroll from "${course?.title}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Unenroll",
                    style: "destructive",
                    onPress: confirmUnenroll
                }
            ]
        );
    };

    const confirmUnenroll = async () => {
        setUnenrolling(true);
        try {
            await API.post(`/courses/unenroll/${courseId}`);

            Alert.alert(
                "Success",
                "You have been unenrolled from this course.",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (error: any) {
            Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to unenroll from course"
            );
        } finally {
            setUnenrolling(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator animating={true} size="large" />
            </View>
        );
    }

    if (!course) {
        return (
            <View style={styles.centered}>
                <Text style={{ color: theme.colors.error }}>Course not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={styles.unenrollButton}
                onPress={handleUnenroll}
                disabled={unenrolling}
            >
                {unenrolling ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <MaterialCommunityIcons name="exit-to-app" size={24} color="#fff" />
                )}
            </TouchableOpacity>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <Text variant="headlineMedium" style={styles.title}>
                    {course.title}
                </Text>
                <Text variant="titleSmall" style={styles.instructor}>
                    Instructor: {course.instructor}
                </Text>

                {course.content.map((item, index) => (
                    <Card key={item._id} style={styles.contentCard} elevation={1}>
                        <Card.Content>
                            <Text variant="titleMedium" style={styles.contentTitle}>
                                {item.title}
                            </Text>
                            <Text variant="bodyMedium" style={styles.contentBody}>
                                {item.body}
                            </Text>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: '600',
        marginBottom: 8,
    },
    instructor: {
        color: '#666',
        marginBottom: 24,
    },
    contentCard: {
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    contentTitle: {
        fontWeight: '600',
        marginBottom: 8,
    },
    contentBody: {
        lineHeight: 22,
        color: '#333',
    },
    unenrollButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e74c3c',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        zIndex: 999,
    },
});

export default CourseDetailsScreen;