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
  ActivityIndicator,
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const MAX_COINS = 50;
  const COINS_PER_PAGE = 10;

  const handleTrendinCoins = async (page: number = 1, append: boolean = false) => {
    if (isLoading || isLoadingMore) return;
    
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=gecko_desc&per_page=${COINS_PER_PAGE}&page=${page}&sparkline=false&price_change_percentage=24h`;
      const res = await axios.get(url);
      const resJson = await res.data;

      if (append) {
        setTrendingData(prevData => [...prevData, ...resJson]);
      } else {
        setTrendingData(resJson);
      }

      // Check if we've reached the max coins limit
      const totalCoins = append ? trendingData.length + resJson.length : resJson.length;
      if (totalCoins >= MAX_COINS || resJson.length < COINS_PER_PAGE) {
        setHasMoreData(false);
      } else {
        setHasMoreData(true);
      }

      setCurrentPage(page);
    } catch (e) {
      console.log('Error fetching coins:', e);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    handleTrendinCoins(1, false);
  }, []);

  const loadMoreCoins = () => {
    if (!isLoadingMore && hasMoreData && trendingData.length < MAX_COINS) {
      const nextPage = currentPage + 1;
      handleTrendinCoins(nextPage, true);
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(2)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(2)}M`;
    } else if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(2)}K`;
    }
    return `$${marketCap.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else if (price >= 0.01) {
      return `$${price.toFixed(4)}`;
    }
    return `$${price.toFixed(8)}`;
  };

  const Item = ({item, index}: {item: any; index: number}) => {
    const coin = item;
    const priceChange24h = coin?.price_change_percentage_24h || 0;
    const isPositive = priceChange24h >= 0;

    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Graph', {id: coin?.id})}
        style={styles.item}
        activeOpacity={0.7}>
        <View style={styles.indexContainer}>
          <Text style={styles.indexNumber}>{index + 1}</Text>
        </View>
        
        <View style={styles.coinInfo}>
          <Image
            alt="coinLogo"
            style={styles.coinLogo}
            source={{uri: coin?.image}}
          />
          <View style={styles.coinDetails}>
            <Text style={styles.symbolStyle}>{coin?.symbol?.toUpperCase()}</Text>
            <Text style={styles.marketcapStyle}>
              {formatMarketCap(coin?.market_cap || 0)}
            </Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            {formatPrice(coin?.current_price || 0)}
          </Text>
          <View
            style={[
              styles.changeBadge,
              {
                backgroundColor: isPositive ? '#00FF8815' : '#FF005015',
              },
            ]}>
            <Text
              style={[
                styles.changeText,
                {color: isPositive ? '#00FF88' : '#FF0050'},
              ]}>
              {isPositive ? '↑' : '↓'} {Math.abs(priceChange24h).toFixed(2)}%
            </Text>
          </View>
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

      {isLoading && trendingData.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D4FF" />
          <Text style={styles.loadingText}>Loading coins...</Text>
        </View>
      ) : (
        <FlatList
          data={trendingData}
          renderItem={({item, index}) => <Item item={item} index={index} />}
          keyExtractor={item => item.id}
          ListHeaderComponent={() => (
            <View style={styles.mainHeader}>
              <Text style={styles.indexHeader}>#</Text>
              <Text style={styles.coinHeader}>Coin</Text>
              <Text style={styles.coinPriceHeader}>Price</Text>
              <Text style={styles.changeHeader}>24h</Text>
            </View>
          )}
          ListFooterComponent={() => {
            if (isLoadingMore) {
              return (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color="#00D4FF" />
                  <Text style={styles.loadingMoreText}>Loading more coins...</Text>
                </View>
              );
            }
            if (!hasMoreData && trendingData.length >= MAX_COINS) {
              return (
                <View style={styles.footerLoader}>
                  <Text style={styles.endText}>Showing {MAX_COINS} coins</Text>
                </View>
              );
            }
            return null;
          }}
          onEndReached={loadMoreCoins}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  listContent: {
    paddingBottom: 20,
  },
  indexContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B8FA3',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#0F1429',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  coinLogo: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  coinDetails: {
    flex: 1,
  },
  symbolStyle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  marketcapStyle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8B8FA3',
    letterSpacing: 0.3,
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  indexHeader: {
    width: 30,
    fontSize: 12,
    fontWeight: '600',
    color: '#8B8FA3',
    textAlign: 'center',
  },
  coinHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#8B8FA3',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  coinPriceHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B8FA3',
    width: 100,
    textAlign: 'right',
    marginRight: 12,
    letterSpacing: 0.5,
  },
  changeHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B8FA3',
    width: 70,
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0E27',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8B8FA3',
    fontWeight: '500',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 14,
    color: '#8B8FA3',
    fontWeight: '500',
  },
  endText: {
    fontSize: 14,
    color: '#8B8FA3',
    fontWeight: '500',
  },
});

export default MarketPage;
