import {Button, Platform, ScrollView, StyleSheet, Text} from 'react-native';

const TestPage3 = (props: any) => {
  return (
    <ScrollView style={{backgroundColor: 'black'}}>
      <Text style={styles.innerText}>TestTestTestTestTestTest 1</Text>
      <Text style={styles.innerText}>TestTestTestTestTestTest 1</Text>
      <Button title="Get" onPress={() => props.navigation.navigate('Home')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  innerText: {
    color: 'red',
  },
  //   safeArea: {
  //     flex: 1,
  //     paddingTop: Platform.OS === 'android' ? '20%' : 0,
  //   },
});

export default TestPage3;
