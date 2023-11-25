import {
  ViewToken,
  View,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import AnimationFiles, {AnimationFilesProps} from './Data/Data';
import RenderAnimtedScreen from './Common Component/RenderAnimtedScreen/RenderAnimtedScreen';
import {FlatList} from 'react-native-gesture-handler';
import Pagination from './Common Component/RenderAnimtedScreen/Pagination/Pagination';

const AnimatedScreen = (props: any) => {
  const flatListRef: any = useAnimatedRef<FlatList<AnimationFilesProps>>();

  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event: any) => {
      x.value = event.contentOffset.x;
    },
  });

  const flatlistIndex = useSharedValue(0);

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems[0].index !== null) {
      flatlistIndex.value = viewableItems[0].index;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        onScroll={onScroll}
        data={AnimationFiles}
        renderItem={({item, index}) => {
          return <RenderAnimtedScreen item={item} index={index} x={x} />;
        }}
        keyExtractor={item => item.id}
        scrollEventThrottle={16}
        horizontal={true}
        bounces={false}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      <View style={styles.bottomContainer}>
        <Pagination data={AnimationFiles} x={x} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  innerText: {
    color: 'red',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    marginHorizontal: 30,
    marginVertical: 30,
  },
});

export default AnimatedScreen;
