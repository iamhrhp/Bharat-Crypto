import axios from 'axios';
import React, {FC, useEffect, useState} from 'react';
import {Button, Dimensions, TouchableOpacity} from 'react-native';
import {View, Text, StyleSheet} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

interface IProps {
  navigation?: any;
  route?: {
    key: string;
    name: string;
    params: any;
    path: string;
  };
}

interface CoinData {
  prices: number[][];
}

const GraphScreen: FC<IProps> = (props: IProps) => {
  const [coinPrices, setCoinPrices] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDay, setIsDay] = useState<number>();

  console.log('props', props);

  const {id} = props?.route?.params;

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${
            isDay ? isDay : 7
          }&interval=daily`,
        );

        // if (!response.ok) {
        //   throw new Error(`HTTP error! Status: ${response.status}`);
        // }
        const data: CoinData = await response.data;
        // console.log('data', data);
        setCoinPrices(data.prices.map(priceData => priceData[1]));
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchCoinData();
  }, [isDay]);

  //   console.log('coinPrices', coinPrices);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.coinContainer}>
        <Text style={styles.CoinName}>{id} Price Chart</Text>
        <View style={styles.btnWrapper}>
          <TouchableOpacity
            style={styles.intervalBtn}
            onPress={() => setIsDay(1)}>
            <Text>24h</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.intervalBtn}
            onPress={() => setIsDay(3)}>
            <Text style={{}}>3D</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.intervalBtn}
            onPress={() => setIsDay(7)}>
            <Text style={{}}>7D</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.intervalBtn}
            onPress={() => setIsDay(30)}>
            <Text style={{}}>30D</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.graphContainer}>
        <LineChart
          data={{
            labels: Array.from({length: coinPrices.length}, (_, index) =>
              index.toString(),
            ),
            datasets: [
              {
                data: coinPrices,
              },
            ],
          }}
          width={Dimensions.get('window').width} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#0d1421',
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    padding: 16,
    flex: 1,
  },
  coinContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // padding: 16,
  },
  graphContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // padding: 16,
  },
  CoinName: {
    textTransform: 'capitalize',
  },
  btnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'grey',
    width: 'auto',
    borderRadius: 5,
    justifyContent: 'space-between',
  },
  intervalBtn: {
    backgroundColor: 'black',
    width: 'auto',
    paddingVertical: 4,
    paddingHorizontal: 12,
    // height: 25,
    alignItems: 'center',
    borderRadius: 5,
    margin: 2,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
});

export default GraphScreen;
