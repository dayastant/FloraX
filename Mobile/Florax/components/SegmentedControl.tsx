import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  activeColor?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedIndex,
  onChange,
  activeColor = '#10b981',
}) => {
  const switchValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(switchValue, {
      toValue: selectedIndex,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }, [selectedIndex]);

  const handlePress = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(index);
  };

  const segmentWidth = (width - 48) / options.length;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.activeSegment,
          {
            width: segmentWidth,
            transform: [
              {
                translateX: switchValue.interpolate({
                  inputRange: [0, options.length - 1],
                  outputRange: [4, (options.length - 1) * segmentWidth + 4],
                }),
              },
            ],
            backgroundColor: 'white', // High contrast for the pill
          },
        ]}
      />
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.segment, { width: segmentWidth }]}
          onPress={() => handlePress(index)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.segmentText,
              selectedIndex === index && { color: activeColor, fontWeight: '700' },
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 44,
    backgroundColor: '#f1f5f9', // slate-100
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 4,
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  activeSegment: {
    position: 'absolute',
    height: 36,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segment: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b', // slate-500
  },
});
