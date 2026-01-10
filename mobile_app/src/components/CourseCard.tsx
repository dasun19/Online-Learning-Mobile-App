import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, useTheme, ActivityIndicator, Card } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import API from "../api/axios";
import { StudentTabParamList } from "../navigation/StudentTabs";

type Props = NativeStackScreenProps<StudentTabParamList, "CourseCard">;

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

const CourseCardScreen: React.FC<Props> = ({ route }) => {
    const { courseId, courseTitle } = route.params;
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [loading, setLoading] = useState(true);
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
    );
};

const styles = StyleSheet.create({
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
});

export default CourseCardScreen;