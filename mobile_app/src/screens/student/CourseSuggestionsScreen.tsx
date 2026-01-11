import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { Text, TextInput, Button, Card, ActivityIndicator, useTheme, Chip } from 'react-native-paper';
import API from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

type Course = {
    _id: string;
    title: string;
    description: string;
};

const CourseSuggestionsScreen: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [requestCount, setRequestCount] = useState(0);
    const [remainingRequests, setRemainingRequests] = useState(250);
    const theme = useTheme();
    const { token } = useContext(AuthContext);

    useEffect(() => {
        fetchCourses();
        fetchRequestCount();
    }, []);

    // Reset recommendation and prompt when navigating back
    useFocusEffect(
        useCallback(() => {
            setRecommendation('');
            setPrompt('');
        }, [])
    );

    const renderRecommendation = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);

        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const boldText = part.slice(2, -2);
                return (
                    <Text key={index} style={{ fontWeight: 'bold' }}>
                        {boldText}
                    </Text>
                );
            }
            return <Text key={index}>{part}</Text>;
        });
    };

    const fetchCourses = async () => {
        try {
            const res = await API.get('/courses/for-students');
            setCourses(res.data);
        } catch (error) {
            console.log('Error fetching courses:', error);
        }
    };

    const fetchRequestCount = async () => {
        try {
            const res = await API.get('/chat/request-count');
            setRequestCount(res.data.requestCount);
            setRemainingRequests(res.data.remainingRequests);
        } catch (error) {
            console.log('Error fetching request count:', error);
        }
    };

    const handleGetRecommendations = async () => {
        if (!prompt.trim()) {
            return;
        }

        setLoading(true);
        try {
            const res = await API.post('/chat/recommendations', {
                prompt,
                availableCourses: courses.map(c => ({
                    title: c.title,
                    description: c.description
                }))
            });

            setRecommendation(res.data.recommendation);
            setRequestCount(res.data.requestCount);
            setRemainingRequests(res.data.remainingRequests);
        } catch (error: any) {
            console.log('Error getting recommendations:', error);
            setRecommendation(
                error.response?.data?.message ||
                'Failed to get recommendations. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const quickPrompts = [
        "I want to be a software engineer",
        "I want to learn web development",
        "I'm interested in data science",
        "I want to learn mobile app development"
    ];

    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
           
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >

                <Text variant="bodyMedium" style={styles.subtitle}>
                    Tell us about your goals and we'll recommend courses for you
                </Text>
                {/* 
                <View style={styles.statsContainer}>
                    <Chip icon="information" style={styles.chip}>
                        Requests: {requestCount}/250
                    </Chip>
                    <Chip icon="counter" style={styles.chip}>
                        Remaining: {remainingRequests}
                    </Chip>
                </View> */}

                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.cardTitle}>
                            Quick Prompts
                        </Text>
                        <View style={styles.quickPromptsContainer}>
                            {quickPrompts.map((quickPrompt, index) => (
                                <Chip
                                    key={index}
                                    mode="outlined"
                                    onPress={() => setPrompt(quickPrompt)}
                                    style={styles.quickPromptChip}
                                >
                                    {quickPrompt}
                                </Chip>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                <TextInput
                    label="What do you want to learn?"
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    value={prompt}
                    onChangeText={setPrompt}
                    placeholder="e.g., I want to be a software engineer, what courses should I follow?"
                    style={styles.input}
                />

                <Button
                    mode="contained"
                    onPress={handleGetRecommendations}
                    loading={loading}
                    disabled={loading || !prompt.trim() || remainingRequests === 0}
                    style={styles.button}
                    icon="robot"
                >
                    Get Recommendations
                </Button>

                {recommendation && (
                    <Card style={styles.recommendationCard} elevation={2}>
                        <Card.Content>
                            <Text variant="titleMedium" style={styles.recommendationTitle}>
                                Our Recommendation
                            </Text>
                            <Text variant="bodyMedium" style={styles.recommendationText}>
                                {renderRecommendation(recommendation)}
                            </Text>
                        </Card.Content>
                    </Card>
                )}

                {remainingRequests === 0 && (
                    <Card style={styles.warningCard}>
                        <Card.Content>
                            <Text style={styles.warningText}>
                                API request limit reached. Please contact administrator.
                            </Text>
                        </Card.Content>
                    </Card>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    topPage: {

        backgroundColor: '#7c3aed',
        marginBottom: 5,

    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    header: {
        marginBottom: 20,
        marginHorizontal: 16,
        marginTop: 16,
        fontWeight: '600',
        color: "#ffff"
    },
    subtitle: {
        color: '#666',
        marginBottom: 30,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    chip: {
        backgroundColor: '#fff',
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    cardTitle: {
        fontWeight: '600',
        marginBottom: 12,
    },
    quickPromptsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    quickPromptChip: {
        marginBottom: 4,
    },
    input: {
        marginTop: 20,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    button: {
        marginBottom: 16,
    },
    recommendationCard: {
        backgroundColor: '#e3f2fd',
        borderRadius: 12,
        marginBottom: 16,
    },
    recommendationTitle: {
        fontWeight: '600',
        marginBottom: 12,
        color: '#1976d2',
    },
    recommendationText: {
        lineHeight: 22,
        color: '#333',
    },
    warningCard: {
        backgroundColor: '#ffebee',
        borderRadius: 12,
    },
    warningText: {
        color: '#c62828',
        textAlign: 'center',
    },
});

export default CourseSuggestionsScreen;