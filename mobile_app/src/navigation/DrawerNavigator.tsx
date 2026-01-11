import React, { useContext, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Animated, PanResponder } from 'react-native';
import { Text, List, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context/AuthContext';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthStack';


type Props = {
  visible: boolean;
  onClose: () => void;
};

type CommonScreens = {
  Profile: undefined;
  Settings: undefined;
  HelpSupport: undefined;
};


const DrawerNavigator: React.FC<Props> = ({ visible, onClose }) => {
  const { logout } = useContext(AuthContext);
  const translateX = useRef(new Animated.Value(-280)).current;
  const navigation = useNavigation<NativeStackNavigationProp<CommonScreens>>();

  useEffect(() => {
    if (visible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      translateX.setValue(-280);
    }
  }, [visible, translateX]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(-280, gestureState.dx));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -80 || gestureState.vx < -0.5) {
          Animated.timing(translateX, {
            toValue: -280,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const handleNavigation = (screenName: keyof CommonScreens) => {
    onClose();
    navigation.navigate(screenName);
  };

  const handleLogout = async () => {

    try {
      onClose();
      await logout();
    } catch (error) {
      console.error('Logout navigation failed:', error);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[styles.drawer, { transform: [{ translateX }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.title}>LearnMate</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.menuItems}>
            <List.Item
              title="Profile"
              left={(props) => <List.Icon {...props} icon="account" color="#7c3aed" />}
              onPress={() => handleNavigation('Profile')}
            />
            <Divider />

            <List.Item
              title="Settings"
              left={(props) => <List.Icon {...props} icon="cog" color="#7c3aed" />}
              onPress={() => handleNavigation('Settings')}
            />
            <Divider />

            <List.Item
              title="Help & Support"
              left={(props) => <List.Icon {...props} icon="help-circle" color="#7c3aed" />}
              onPress={() => handleNavigation('HelpSupport')}
            />
          </View>

          <View style={styles.footer}>
            <Divider />
            <List.Item
              title="Logout"
              titleStyle={styles.logoutText}
              left={(props) => <List.Icon {...props} icon="logout" color="#e74c3c" />}
              onPress={handleLogout}
            />
          </View>
        </Animated.View>

        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlay: {
    flex: 1,
  },
  drawer: {
    width: 280,
    backgroundColor: '#fff',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    backgroundColor: '#7c3aed',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: '600',
  },
  menuItems: {
    flex: 1,
    paddingTop: 10,
  },
  footer: {
    paddingBottom: 20,
  },
  logoutText: {
    color: '#e74c3c',
    fontWeight: '600',
  },
});

export default DrawerNavigator;