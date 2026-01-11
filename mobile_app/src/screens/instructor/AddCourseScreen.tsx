import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, IconButton } from 'react-native-paper';
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type TabsParamList = {
  MyCourses: undefined;
  AddCourse: undefined;
};

type Props = BottomTabScreenProps<TabsParamList, 'AddCourse'>;

type ContentItem = {
  title: string;
  body: string;
};

const AddCourseScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<ContentItem[]>([{ title: "", body: "" }]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const { user } = useContext(AuthContext);
  const theme = useTheme();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
        navigation.navigate('MyCourses');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigation]);

  const addContentItem = () => {
    setContent([...content, { title: "", body: "" }]);
  };

  const removeContentItem = (index: number) => {
    const newContent = content.filter((_, i) => i !== index);
    setContent(newContent);
  };

  const updateContentItem = (index: number, field: 'title' | 'body', value: string) => {
    const newContent = [...content];
    newContent[index][field] = value;
    setContent(newContent);
  };

  const handleSubmit = async () => {
    try {
      if (!user) return;

      const validContent = content.filter(item => item.title.trim() && item.body.trim());

      await API.post("/courses/create", {
        title,
        description,
        content: validContent,
      });

      setSuccess("Course created successfully!");
      setTitle("");
      setDescription("");
      setContent([{ title: "", body: "" }]);
    } catch (error: any) {
      console.log(error.response?.data?.message);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Network error. Please wait.");
      }
    }
  };

  const isFormValid = () => {
    const hasValidContent = content.some(item => item.title.trim() && item.body.trim());
    return title.trim() && description.trim() && hasValidContent;
  };

  return (
    <>
      <View style={styles.topPage}>
        <Text variant="headlineMedium" style={styles.header}>
          Create New Course
        </Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>


        <TextInput
          label="Course Title"
          mode="outlined"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter course title"
        />

        <TextInput
          label="Description"
          mode="outlined"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter course description"
          multiline
          numberOfLines={4}
        />

        <View style={styles.contentSection}>
          <View style={styles.contentHeader}>
            <Text variant="titleMedium" style={styles.contentTitle}>
              Course Content
            </Text>
            <Button
              mode="outlined"
              icon="plus"
              onPress={addContentItem}
              compact
            >
              Add Section
            </Button>
          </View>

          {content.map((item, index) => (
            <View key={index} style={styles.contentItem}>
              <View style={styles.contentItemHeader}>
                <Text variant="labelLarge">Section {index + 1}</Text>
                {content.length > 1 && (
                  <IconButton
                    icon="delete"
                    iconColor="#e74c3c"
                    size={20}
                    onPress={() => removeContentItem(index)}
                  />
                )}
              </View>

              <TextInput
                label="Section Title"
                mode="outlined"
                style={styles.contentInput}
                value={item.title}
                onChangeText={(value) => updateContentItem(index, 'title', value)}
                placeholder="e.g., Introduction, Chapter 1"
              />

              <TextInput
                label="Section Body"
                mode="outlined"
                style={styles.contentInput}
                value={item.body}
                onChangeText={(value) => updateContentItem(index, 'body', value)}
                placeholder="Enter section content"
                multiline
                numberOfLines={4}
              />
            </View>
          ))}
        </View>

        <Button
          mode="contained"
          disabled={!isFormValid()}
          onPress={handleSubmit}
          style={styles.button}
        >
          Create Course
        </Button>

        {error ? (
          <Text style={[styles.message, { color: theme.colors.error }]}>
            {error}
          </Text>
        ) : null}

        {success ? (
          <Text style={[styles.message, { color: '#10b981' }]}>
            {success}
          </Text>
        ) : null}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
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
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  contentSection: {
    marginBottom: 16,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contentTitle: {
    fontWeight: '600',
  },
  contentItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  contentItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contentInput: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default AddCourseScreen;