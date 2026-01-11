import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface AIButtonProps {
  onPress?: () => void;
  navigateTo?: string;
}

const AIButton: React.FC<AIButtonProps> = ({ 
  onPress, 
  navigateTo = 'CourseSuggestions' 
}) => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Position state
  const pan = useRef(new Animated.ValueXY({ x: width - 100, y: height - 250 })).current;
  const [isDragging, setIsDragging] = useState(false);

  React.useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Pan responder for dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
        
        // Scale down when starting to drag
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          useNativeDriver: true,
        }).start();
      },

      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),

      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();
        setIsDragging(false);

        // Snap to edges if close
        const finalX = pan.x._value;
        const finalY = pan.y._value;

        // Boundaries
        const minX = 0;
        const maxX = width - 60;
        const minY = 0;
        const maxY = height - 60;

        // Constrain position
        const constrainedX = Math.max(minX, Math.min(maxX, finalX));
        const constrainedY = Math.max(minY, Math.min(maxY, finalY));

        Animated.spring(pan, {
          toValue: { x: constrainedX, y: constrainedY },
          useNativeDriver: false,
        }).start();

        // Scale back to normal
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }).start();

        // If it was just a tap (minimal movement), trigger the press action
        if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
          handlePress();
        }
      },
    })
  ).current;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate(navigateTo as never);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Pulse ring effect */}
      {!isDragging && (
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseAnim }],
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.1],
                outputRange: [0.5, 0],
              }),
            },
          ]}
        />
      )}

      {/* Main button */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.button}>
          <IconButton
            icon="robot"
            iconColor="#fff"
            size={28}
            style={styles.icon}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
  },
  pulseRing: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#7c3aed',
    top: -5,
    left: -5,
  },
  buttonContainer: {
    shadowColor: '#7c3aed',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  icon: {
    margin: 0,
  },
});

export default AIButton;