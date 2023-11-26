import {StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {AnimationFilesProps} from '../../../Data/Data';
import {SharedValue} from 'react-native-reanimated';
import DotPage from './DotPage';

interface IProps {
  data: AnimationFilesProps[];
  x?: SharedValue<number>;
}

const Pagination: FC<IProps> = ({data, x}: IProps) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((item, index) => {
        return <DotPage key={index} index={index} x={x} />;
      })}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
