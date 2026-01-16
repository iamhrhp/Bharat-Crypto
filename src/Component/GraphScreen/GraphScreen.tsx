import axios from 'axios';
import React, {FC, useEffect, useState, useRef} from 'react';
import {Dimensions, TouchableOpacity, ActivityIndicator, ScrollView} from 'react-native';
import {View, Text, StyleSheet} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import Animated, {FadeIn, FadeInDown} from 'react-native-reanimated';

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
  market_caps: number[][];
  total_volumes: number[][];
}

const GraphScreen: FC<IProps> = (props: IProps) => {
  const [coinPrices, setCoinPrices] = useState<number[]>([]);
  const [marketCaps, setMarketCaps] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDay, setIsDay] = useState<number>(7);
  const screenWidth = Dimensions.get('window').width;
  const scrollViewRef = useRef<ScrollView>(null);

  console.log('props', props);

  const {id} = props?.route?.params;

  useEffect(() => {
    const fetchCoinData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${
            isDay ? isDay : 7
          }&interval=daily`,
        );

        const data: CoinData = await response.data;
        const prices = data.prices.map(priceData => priceData[1]);
        const marketCaps = data.market_caps.map(mcapData => mcapData[1]);
        setCoinPrices(prices);
        setMarketCaps(marketCaps);
        setIsLoading(false);
        
        // Calculate chart width for debugging
        const chartWidth = prices.length > 3 
          ? Math.max(screenWidth * 3, prices.length * 150)
          : screenWidth - 80;
        console.log('Chart width:', chartWidth, 'Screen width:', screenWidth, 'Data points:', prices.length, 'Should scroll:', chartWidth > screenWidth);
        
        // Scroll to end (most recent data) after a short delay
        setTimeout(() => {
          if (scrollViewRef.current && prices.length > 3) {
            scrollViewRef.current.scrollToEnd({animated: false});
          }
        }, 500);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchCoinData();
  }, [isDay, id]);

  // Calculate price change
  const currentPrice = coinPrices.length > 0 ? coinPrices[coinPrices.length - 1] : 0;
  const previousPrice = coinPrices.length > 0 ? coinPrices[0] : 0;
  const priceChange = currentPrice && previousPrice ? currentPrice - previousPrice : 0;
  const priceChangePercent = previousPrice > 0 
    ? ((priceChange / previousPrice) * 100).toFixed(2) 
    : '0.00';
  const isPositive = priceChange >= 0;

  // Calculate market cap change
  const currentMarketCap = marketCaps.length > 0 ? marketCaps[marketCaps.length - 1] : 0;
  const previousMarketCap = marketCaps.length > 0 ? marketCaps[0] : 0;
  const marketCapChange = currentMarketCap && previousMarketCap ? currentMarketCap - previousMarketCap : 0;
  const marketCapChangePercent = previousMarketCap > 0 
    ? ((marketCapChange / previousMarketCap) * 100).toFixed(2) 
    : '0.00';
  const isMarketCapPositive = marketCapChange >= 0;

  //   console.log('coinPrices', coinPrices);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00D4FF" />
        <Text style={styles.loadingText}>Loading chart data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setIsLoading(true);
            setError(null);
          }}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.coinName}>{id?.toUpperCase() || 'CRYPTO'}</Text>
          {currentPrice && (
            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>
                ${currentPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              <View
                style={[
                  styles.changeContainer,
                  {backgroundColor: isPositive ? '#00FF8815' : '#FF005015'},
                ]}>
                <Text
                  style={[
                    styles.changeText,
                    {color: isPositive ? '#00FF88' : '#FF0050'},
                  ]}>
                  {isPositive ? '↑' : '↓'} {Math.abs(parseFloat(priceChangePercent))}%
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.btnWrapper}>
          <TouchableOpacity
            style={[styles.intervalBtn, isDay === 1 && styles.intervalBtnActive]}
            onPress={() => setIsDay(1)}>
            <Text
              style={[
                styles.intervalBtnText,
                isDay === 1 && styles.intervalBtnTextActive,
              ]}>
              24h
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.intervalBtn, isDay === 3 && styles.intervalBtnActive]}
            onPress={() => setIsDay(3)}>
            <Text
              style={[
                styles.intervalBtnText,
                isDay === 3 && styles.intervalBtnTextActive,
              ]}>
              3D
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.intervalBtn, isDay === 7 && styles.intervalBtnActive]}
            onPress={() => setIsDay(7)}>
            <Text
              style={[
                styles.intervalBtnText,
                isDay === 7 && styles.intervalBtnTextActive,
              ]}>
              7D
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.intervalBtn, isDay === 30 && styles.intervalBtnActive]}
            onPress={() => setIsDay(30)}>
            <Text
              style={[
                styles.intervalBtnText,
                isDay === 30 && styles.intervalBtnTextActive,
              ]}>
              30D
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(800).delay(200)}
        style={styles.graphContainer}>
        <View
          style={[
            styles.glowWrapper,
            {
              shadowColor: isPositive ? '#00FF88' : '#FF0050',
            },
          ]}>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Price Movement</Text>
              <View style={styles.legendContainer}>
                <View
                  style={[
                    styles.legendDot,
                    {backgroundColor: isPositive ? '#00FF88' : '#FF0050'},
                  ]}
                />
                <Text style={styles.legendText}>
                  {isPositive ? 'Bullish' : 'Bearish'} Trend
                </Text>
              </View>
            </View>
          {coinPrices.length > 0 ? (
            <View style={styles.chartWrapper}>
              <ScrollView
                ref={scrollViewRef}
                horizontal={true}
                showsHorizontalScrollIndicator={true}
                bounces={true}
                contentContainerStyle={styles.scrollContent}
                style={styles.scrollView}
                decelerationRate="normal"
                scrollEnabled={true}
                nestedScrollEnabled={true}
                alwaysBounceHorizontal={false}
                pagingEnabled={false}
                directionalLockEnabled={false}>
                <View 
                  style={{
                    width: coinPrices.length > 3 
                      ? Math.max(screenWidth * 3, coinPrices.length * 150)
                      : screenWidth - 80,
                    minWidth: screenWidth * 2.5,
                  }}>
                  <LineChart
                data={{
                  labels: Array.from({length: coinPrices.length}, (_, index) => {
                    // Show labels more frequently for scrollable chart
                    if (coinPrices.length <= 10) {
                      return index.toString();
                    }
                    // Show labels at intervals
                    const interval = Math.max(1, Math.floor(coinPrices.length / 8));
                    if (index === 0 || index === coinPrices.length - 1 || index % interval === 0) {
                      return index.toString();
                    }
                    return '';
                  }),
                  datasets: [
                    {
                      data: coinPrices,
                    },
                  ],
                }}
                width={coinPrices.length > 3 
                  ? Math.max(screenWidth * 3, coinPrices.length * 150)
                  : screenWidth - 80}
                height={300}
            yAxisLabel="$"
            yAxisSuffix=""
            yAxisInterval={1}
            segments={4}
            formatXLabel={(value) => {
              if (!value || value === '') return '';
              return value;
            }}
            chartConfig={{
              backgroundColor: '#0F1429',
              backgroundGradientFrom: isPositive ? '#00FF8820' : '#FF005020',
              backgroundGradientTo: '#0F1429',
              decimalPlaces: 2,
              color: (opacity = 1) =>
                isPositive
                  ? `rgba(0, 255, 136, ${opacity})`
                  : `rgba(255, 0, 80, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
              strokeWidth: 3,
              barPercentage: 0.7,
              useShadowColorFromDataset: false,
              formatYLabel: (value) => {
                const num = parseFloat(value);
                if (num >= 1000) {
                  return `$${(num / 1000).toFixed(1)}k`;
                }
                return `$${num.toFixed(2)}`;
              },
              style: {
                borderRadius: 20,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '3',
                stroke: isPositive ? '#00FF88' : '#FF0050',
                fill: isPositive ? '#00FF88' : '#FF0050',
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: 'rgba(255, 255, 255, 0.08)',
                strokeWidth: 1,
              },
            }}
            bezier
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withDots={coinPrices.length <= 15}
            withShadow={false}
            fromZero={false}
            style={{
              marginVertical: 8,
              borderRadius: 20,
            }}
            />
                </View>
              </ScrollView>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No chart data available</Text>
            </View>
          )}
          </View>

          {/* Market Cap Data Display */}
          {marketCaps.length > 0 && currentMarketCap > 0 && (
            <Animated.View 
              entering={FadeIn.duration(600).delay(400)}
              style={styles.dataContainer}>
              <View style={styles.dataCard}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Market Cap</Text>
                  <View style={styles.dataValueContainer}>
                    <Text style={styles.dataValue}>
                      ${(currentMarketCap / 1000000000).toFixed(2)}B
                    </Text>
                    <View
                      style={[
                        styles.changeContainer,
                        {backgroundColor: isMarketCapPositive ? '#00FF8815' : '#FF005015', marginLeft: 8},
                      ]}>
                      <Text
                        style={[
                          styles.changeText,
                          {color: isMarketCapPositive ? '#00FF88' : '#FF0050'},
                        ]}>
                        {isMarketCapPositive ? '↑' : '↓'} {Math.abs(parseFloat(marketCapChangePercent))}%
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.dataDivider} />
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>24h Low</Text>
                  <Text style={styles.dataValue}>
                    ${Math.min(...coinPrices).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
                <View style={styles.dataDivider} />
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>24h High</Text>
                  <Text style={styles.dataValue}>
                    ${Math.max(...coinPrices).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#0A0E27',
    flex: 1,
    paddingTop: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  coinName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  changeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  btnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1F3A',
    borderRadius: 12,
    padding: 4,
  },
  intervalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    marginHorizontal: 2,
  },
  intervalBtnActive: {
    backgroundColor: '#00D4FF',
    shadowColor: '#00D4FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  intervalBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B8FA3',
  },
  intervalBtnTextActive: {
    color: '#0A0E27',
    fontWeight: '700',
  },
  graphContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  glowWrapper: {
    borderRadius: 24,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 20,
  },
  chartCard: {
    backgroundColor: '#0F1429',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
  },
  chartWrapper: {
    width: '100%',
    overflow: 'visible',
  },
  scrollView: {
    width: '100%',
    height: 320,
  },
  scrollContent: {
    paddingRight: 20,
    alignItems: 'flex-start',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8B8FA3',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0E27',
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0050',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#00D4FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#00D4FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  retryButtonText: {
    color: '#0A0E27',
    fontSize: 16,
    fontWeight: '700',
  },
  noDataContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#8B8FA3',
    fontSize: 16,
    fontWeight: '500',
  },
  marketCapInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  dataCard: {
    backgroundColor: '#0F1429',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B8FA3',
    letterSpacing: 0.5,
  },
  dataValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  dataDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 4,
  },
});

export default GraphScreen;
