import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import {AnimationFilesProps} from '../../Data/Data';
import LottieView from 'lottie-react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  SharedValue,
} from 'react-native-reanimated';

interface IProps {
  item: AnimationFilesProps;
  index: number;
  x: SharedValue<number>;
}

const RenderAnimtedScreen = ({item, index, x}: IProps) => {
  const {width: SCREEN_WIDTH} = useWindowDimensions();

  const circleAnimation: any = useAnimatedStyle(() => {
    const scale = interpolate(
      x?.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [1, 4, 4],
      Extrapolate.CLAMP,
    );
    return {
      transform: [{scale: scale}],
    };
  });

  return (
    <View style={[styles.container, {width: SCREEN_WIDTH}]}>
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            {
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH,
              backgroundColor: item.backGroundColor,
              borderRadius: SCREEN_WIDTH / 2,
            },
            circleAnimation,
          ]}
        />
      </View>
      <View>
        <LottieView
          source={item.animation}
          style={{width: SCREEN_WIDTH * 0.9, height: SCREEN_WIDTH * 0.9}}
          autoPlay
          loop
        />
      </View>
      <Text style={[styles.itemText, {color: item.textColor}]}>
        {item.text}
      </Text>
    </View>
  );
};

export default RenderAnimtedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 120,
  },
  itemText: {
    textAlign: 'center',
    fontSize: 44,
    fontWeight: 'bold',
    marginBottom: 10,
    marginHorizontal: 120,
  },
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
