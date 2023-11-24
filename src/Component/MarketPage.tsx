import axios from 'axios';
import {FC, useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SectionList,
  Pressable,
} from 'react-native';
import {CoinList} from '../Config/Config';
import {TouchableOpacity} from 'react-native';

export function numberWithCommas(x: any) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
interface IProps {
  navigation: any;
}

const MarketPage: FC<IProps> = (props: IProps) => {
  const [trendingData, setTrendingData] = useState<any[]>([]);

  // console.log('props', props);

  const handleTrendinCoins = async () => {
    try {
      const res = await axios.get(CoinList);
      const resJson = await res.data;
      setTrendingData(resJson);

      // console.log(resJson);
    } catch (e) {
      console.log('e', e);
    }
  };
  console.log(trendingData);

  // type ItemProps = {title: any};
  useEffect(() => {
    const getCoinsData = setTimeout(async () => {
      handleTrendinCoins();
    }, 1000);
    return () => clearTimeout(getCoinsData);
  }, []);

  const Item = (data: any, index: any) => {
    // console.log(data);
    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Graph', {id: data?.data?.id})}
        style={styles.item}>
        <View style={styles.indexStyle}>
          <Text style={styles.indexNumber}>{data.index + 1}</Text>
        </View>
        <View style={styles.logoBox}>
          <Image
            alt="coinLogo"
            style={styles.coinLogo}
            source={{uri: data?.data?.image}}
          />
          <View>
            <Text style={styles.symbolStyle}>{data?.data?.symbol}</Text>
            <Text style={styles.marketcapStyle}>
              $
              {numberWithCommas(data?.data?.market_cap.toString().slice(0, -6))}
            </Text>
          </View>
        </View>
        <View style={styles.itemPrice}>
          <Text style={styles.title}>
            ${numberWithCommas(data?.data?.current_price.toFixed(2))}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainWrapper}>
      {/* <FlatList
        data={trendingData}
        renderItem={({item}) => <Item data={item.item} />}
        keyExtractor={item => item.id}
      /> */}

      <FlatList
        data={trendingData}
        renderItem={({item, index}) => <Item data={item} index={index} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <View style={styles.mainHeader}>
            <Text style={styles.indexHeader}>#</Text>
            <Text style={styles.coinHeader}>Market Cap</Text>
            <Text style={styles.coinPriceHeader}>Price</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {flex: 1, backgroundColor: '#0d1421'},

  indexStyle: {
    width: 20,
    marginRight: 10,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    // height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  itemPrice: {
    width: 80,
  },
  symbolStyle: {
    fontSize: 14,
    marginLeft: 5,
    color: 'white',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    marginLeft: 5,
    color: 'white',
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  marketcapStyle: {
    fontSize: 9,
    marginLeft: 5,
    color: 'silver',
    textTransform: 'uppercase',
  },
  coinLogo: {height: 24, width: 24, borderRadius: 20},
  logoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 60,
    color: 'white',
    marginRight: 50,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
    flexDirection: 'row',
    color: 'white',
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 30,
    color: 'white',
  },
  indexNumber: {
    color: 'white',
  },
  indexHeader: {color: 'white'},
  coinHeader: {color: 'white', marginLeft: 20, fontSize: 12},
  coinPriceHeader: {marginLeft: 100, color: 'white', fontSize: 12},
});

export default MarketPage;
