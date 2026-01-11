import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, useTheme, ActivityIndicator, Card, Button, DataTable } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import API from "../../api/axios";
import { InstructorTabParamList } from "../../navigation/InstructorTabs";

type Props = NativeStackScreenProps<InstructorTabParamList, "CourseDetails">;

type ContentItem = {
    _id: string;
    title: string;
    body: string;
};

type Student = {
    _id: string;
    name: string;
    email: string;
    enrolledAt?: string;
};

type CourseDetail = {
    _id: string;
    title: string;
    description: string;
    content: ContentItem[];
    instructor: string;
    enrolledCount: number;
    enrolledStudents?: string[];
};

const CourseDetailsScreen: React.FC<Props> = ({ route }) => {
    const { courseId } = route.params;
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [showStudents, setShowStudents] = useState(false);
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

    const fetchStudents = async () => {
        setLoadingStudents(true);
        try {
            const res = await API.get(`/courses/${courseId}/students`);
            console.log("Students fetched:", res.data);
            setStudents(res.data);
        } catch (error: any) {
            console.log("Error fetching students:", error.response?.data || error);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleToggleStudents = async () => {
        if (!showStudents && students.length === 0) {
            await fetchStudents();
        }
        setShowStudents(!showStudents);
    };

    const capitalizeWords = (str: string) => {
        if (!str) return '';
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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


    const enrolledCount = course.enrolledCount || course.enrolledStudents?.length || 0;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <Text variant="headlineMedium" style={styles.title}>
                {course.title}
            </Text>

            <Text variant="bodyMedium" style={styles.description}>
                {course.description}
            </Text>

            <Text variant="titleSmall" style={styles.instructor}>
                Instructor: {capitalizeWords(course.instructor)}
            </Text>

            <Text variant="bodySmall" style={styles.enrollment}>
                {enrolledCount > 0
                    ? `${enrolledCount} student${enrolledCount > 1 ? "s" : ""} enrolled`
                    : "No students enrolled yet"}
            </Text>

            <Text variant="titleMedium" style={styles.contentHeader}>
                Course Content
            </Text>

            {course.content.map((item) => (
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

            {enrolledCount > 0 && (
                <Button
                    mode="contained"
                    icon={showStudents ? "chevron-up" : "chevron-down"}
                    onPress={handleToggleStudents}
                    style={styles.toggleButton}
                    loading={loadingStudents}
                >
                    {showStudents ? "Hide" : "View"} Enrolled Students ({enrolledCount})
                </Button>
            )}

            {showStudents && (
                <Card style={styles.studentsCard} elevation={2}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.studentsHeader}>
                            Enrolled Students
                        </Text>

                        {loadingStudents ? (
                            <ActivityIndicator animating={true} style={styles.loader} />
                        ) : students.length === 0 ? (
                            <Text style={styles.emptyText}>No students found</Text>
                        ) : (
                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                <DataTable>
                                    <DataTable.Header>
                                        <DataTable.Title style={{ width: 150 }}>Name</DataTable.Title>
                                        <DataTable.Title style={{ width: 250 }}>Email</DataTable.Title>
                                        <DataTable.Title style={{ width: 150 }}>Enrolled Date</DataTable.Title>
                                    </DataTable.Header>

                                    {students.map((student) => (
                                        <DataTable.Row key={student._id}>
                                            <DataTable.Cell style={{ width: 150 }}>{student.name}</DataTable.Cell>
                                            <DataTable.Cell style={{ width: 250 }}>{student.email}</DataTable.Cell>
                                            <DataTable.Cell style={{ width: 150 }}>
                                                {formatDate(student.enrolledAt)}
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    ))}
                                </DataTable>
                            </ScrollView>
                        )}
                    </Card.Content>
                </Card>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: '600',
        marginBottom: 12,
    },
    description: {
        color: '#666',
        marginBottom: 8,
        lineHeight: 22,
    },
    instructor: {
        color: '#666',
        marginBottom: 4,
    },
    enrollment: {
        color: '#999',
        fontSize: 12,
        marginBottom: 16,
    },
    toggleButton: {
        marginBottom: 16,
    },
    studentsCard: {
        marginBottom: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    studentsHeader: {
        fontWeight: '600',
        marginBottom: 16,
    },
    loader: {
        marginVertical: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        paddingVertical: 20,
    },
    contentHeader: {
        fontWeight: '600',
        marginBottom: 16,
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

export default CourseDetailsScreen;