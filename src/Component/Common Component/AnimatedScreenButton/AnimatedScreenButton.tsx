import {
  Image,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import Animated, {
  SharedValue,
  AnimatedRef,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  withTiming,
} from 'react-native-reanimated';
import {AnimationFilesProps} from '../../Data/Data';

interface IProps {
  dataLength: number;
  flatlistIndex: SharedValue<number>;
  flatListRef: AnimatedRef<FlatList<AnimationFilesProps>>;
  x: SharedValue<number>;
}

const AnimatedScreenButton = ({
  flatlistIndex,
  flatListRef,
  dataLength,
  x,
}: IProps) => {
  const {width: SCREEN_WIDTH} = useWindowDimensions();

  const buttonAnimationStyle = useAnimatedStyle(() => {
    return {
      width:
        flatlistIndex.value === dataLength - 1
          ? withSpring(140)
          : withSpring(60),
      height: 60,
    };
  });

  const arrowAnimationStyle = useAnimatedStyle(() => {
    return {
      width: 30,
      height: 30,
      opacity:
        flatlistIndex.value === dataLength - 1 ? withTiming(0) : withTiming(1),
      transform: [
        {
          translateX:
            flatlistIndex.value === dataLength - 1
              ? withTiming(100)
              : withTiming(0),
        },
      ],
    };
  });

  const textAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity:
        flatlistIndex.value === dataLength - 1 ? withTiming(1) : withTiming(0),
      transform: [
        {
          translateX:
            flatlistIndex.value === dataLength - 1
              ? withTiming(0)
              : withTiming(-100),
        },
      ],
    };
  });

  const animatedColor = useAnimatedStyle(() => {
    const backGroundColor = interpolateColor(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
      ['#005b4f', '#1e2169', '#f15937'],
    );
    return {
      backgroundColor: backGroundColor,
    };
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (flatlistIndex.value < dataLength - 1) {
          flatListRef.current?.scrollToIndex({index: flatlistIndex.value + 1});
        } else {
          console.log('Navigate to Next Screen');
        }
      }}>
      <Animated.View
        style={[styles.container, animatedColor, buttonAnimationStyle]}>
        <Animated.Text style={[styles.textButton, textAnimationStyle]}>
          Get Started
        </Animated.Text>
        <Animated.Image
          source={require('../../assets/images/ArrowIcon.png')}
          style={[styles.arrowBtn, arrowAnimationStyle]}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default AnimatedScreenButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e2169',
    padding: 10,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    // width: 60,
    // height: 60,
  },
  arrowBtn: {
    position: 'absolute',
  },

  textButton: {color: 'white', fontSize: 16, position: 'absolute'},
});
