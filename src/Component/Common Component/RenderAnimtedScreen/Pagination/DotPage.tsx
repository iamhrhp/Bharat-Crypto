import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  Extrapolate,
  interpolateColor,
} from 'react-native-reanimated';

interface IProps {
  index: number;
  x: any;
}

const DotPage = ({index, x}: IProps) => {
  const {width: SCREEN_WIDTH} = useWindowDimensions();

  const animationDotStyle = useAnimatedStyle(() => {
    const widthAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [10, 20, 10],
      Extrapolate.CLAMP,
    );
    const opacityAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0.5, 1, 0.5],
      Extrapolate.CLAMP,
    );
    return {
      width: widthAnimation,
      opacity: opacityAnimation,
    };
  });

  const animatedClr = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
      ['#005b4f', '#1e2169', '#f15937'],
    );
    return {
      backgroundColor: backgroundColor,
    };
  });

  return (
    <Animated.View
      style={[styles.dotContainer, animationDotStyle, animatedClr]}
    />
  );
};

export default DotPage;

const styles = StyleSheet.create({
  dotContainer: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
});
