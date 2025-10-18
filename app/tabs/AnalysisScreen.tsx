import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AnalysisScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri, analysis } = route.params as { 
    imageUri: string; 
    analysis?: any; 
  };

  const handleSave = () => {
    navigation.goBack();
  };

  // Helper function to get color based on value and context
  const getColor = (value: string, positive: boolean) => {
    if (value === 'High' || value === 'Strong' || value === 'Bullish') {
      return positive ? '#10B981' : '#EF4444'; // Green or Red
    } else if (value === 'Medium' || value === 'Moderate' || value === 'Neutral') {
      return '#F59E0B'; // Orange
    } else if (value === 'Low' || value === 'Weak' || value === 'Bearish') {
      return positive ? '#F59E0B' : '#EF4444'; // Orange or Red
    }
    // Pattern-specific colors
    if (value.includes('Breakout') || value.includes('Flag') || value.includes('Bullish')) {
      return '#10B981'; // Green
    } else if (value.includes('Head') || value.includes('Double') || value.includes('Bearish')) {
      return '#EF4444'; // Red
    }
    return positive ? '#10B981' : '#EF4444';
  };
  
  // Use real analysis data if available, otherwise fallback to dummy data
  const analysisData = analysis?.keyInsights ? {
    symbol: analysis.chartSymbol || 'Unknown Symbol',
    timeRange: analysis.timeRange || 'Unknown',
    trend: analysis.keyInsights.trend.value,
    trendPositive: analysis.keyInsights.trend.positive,
    volatility: analysis.keyInsights.volatility.value,
    volatilityPositive: analysis.keyInsights.volatility.positive,
    momentum: analysis.keyInsights.momentum.value,
    momentumPercentage: analysis.keyInsights.momentum.percentage,
    momentumPositive: analysis.keyInsights.momentum.positive,
    patternType: analysis.keyInsights.patternType.value,
    patternPositive: analysis.keyInsights.patternType.positive,
    summary: analysis.summary || analysis.description,
    technicals: [
      { label: 'RSI (14)', value: '42.8', change: 'Oversold', positive: false },
      { label: 'MACD', value: '-125.4', change: 'Bearish', positive: false },
      { label: 'Market Cap', value: '$1.2T', change: '+2.5%', positive: true },
      { label: '24h Volume', value: '$45.3B', change: '-5.2%', positive: false },
    ],
    fundamentals: [
      { 
        title: 'Fed Interest Rate Decision Expected', 
        time: '2 hours ago',
        sentiment: 'bearish',
        description: 'Federal Reserve expected to maintain higher rates, potentially impacting crypto markets negatively.'
      },
      { 
        title: 'Major Exchange Adds BTC ETF Trading', 
        time: '5 hours ago',
        sentiment: 'bullish',
        description: 'Institutional adoption increases as major exchange launches Bitcoin ETF trading pairs.'
      },
      { 
        title: 'Whale Wallet Moves 5,000 BTC', 
        time: '8 hours ago',
        sentiment: 'bearish',
        description: 'Large BTC holder transferred significant holdings to exchange, indicating potential sell pressure.'
      },
      { 
        title: 'Bitcoin Mining Difficulty Increases', 
        time: '12 hours ago',
        sentiment: 'bullish',
        description: 'Network security strengthens as mining difficulty reaches all-time high, showing miner confidence.'
      },
    ],
  } : {
    // Fallback dummy data when no analysis is available
    symbol: 'BTC/USDT',
    timeRange: '4H',
    trend: 'Bearish',
    trendPositive: false,
    volatility: 'High',
    volatilityPositive: false,
    momentum: 'Moderate',
    momentumPercentage: 60,
    momentumPositive: true,
    patternType: 'Head & Shoulders',
    patternPositive: false,
    summary: 'The chart shows a bearish trend with high volatility. The price is currently below key support levels, indicating potential further downside. Momentum is moderate, suggesting some buying interest, but not enough to reverse the trend.',
    technicals: [
      { label: 'RSI (14)', value: '42.8', change: 'Oversold', positive: false },
      { label: 'MACD', value: '-125.4', change: 'Bearish', positive: false },
      { label: 'Market Cap', value: '$1.2T', change: '+2.5%', positive: true },
      { label: '24h Volume', value: '$45.3B', change: '-5.2%', positive: false },
    ],
    fundamentals: [
      { 
        title: 'Fed Interest Rate Decision Expected', 
        time: '2 hours ago',
        sentiment: 'bearish',
        description: 'Federal Reserve expected to maintain higher rates, potentially impacting crypto markets negatively.'
      },
      { 
        title: 'Major Exchange Adds BTC ETF Trading', 
        time: '5 hours ago',
        sentiment: 'bullish',
        description: 'Institutional adoption increases as major exchange launches Bitcoin ETF trading pairs.'
      },
      { 
        title: 'Whale Wallet Moves 5,000 BTC', 
        time: '8 hours ago',
        sentiment: 'bearish',
        description: 'Large BTC holder transferred significant holdings to exchange, indicating potential sell pressure.'
      },
      { 
        title: 'Bitcoin Mining Difficulty Increases', 
        time: '12 hours ago',
        sentiment: 'bullish',
        description: 'Network security strengthens as mining difficulty reaches all-time high, showing miner confidence.'
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <Text style={styles.headerTitle}>Chart Analysis</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Feather name="save" size={20} color={colors.lightest} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Chart Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.chartImage} resizeMode="cover" />
        </View>

        {/* Symbol and Time Range */}
        <View style={styles.symbolContainer}>
          <View style={styles.symbolBox}>
            <Text style={styles.symbolLabel}>Symbol</Text>
            <Text style={styles.symbolValue}>{analysisData.symbol}</Text>
          </View>
          <View style={styles.timeRangeBox}>
            <Text style={styles.timeRangeLabel}>Time Range</Text>
            <Text style={styles.timeRangeValue}>{analysisData.timeRange}</Text>
          </View>
        </View>

        {/* Key Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Key Insights</Text>
          
          {/* Top Row: Trend and Volatility */}
          <View style={styles.insightsRow}>
            {/* Trend */}
            <View style={styles.insightBox}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightLabel}>Trend</Text>
                <Feather name="info" size={16} color={colors.lighter} />
              </View>
              <View style={styles.insightContent}>
                <View style={styles.iconBox}>
                  <Feather 
                    name={analysisData.trendPositive ? "trending-up" : "trending-down"} 
                    size={28} 
                    color={analysisData.trendPositive ? "#10B981" : "#EF4444"} 
                  />
                </View>
                <Text style={[
                  styles.insightValue, 
                  { color: getColor(analysisData.trend, analysisData.trendPositive) }
                ]}>
                  {analysisData.trend}
                </Text>
              </View>
            </View>

            {/* Volatility */}
            <View style={styles.insightBox}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightLabel}>Volatility</Text>
                <Feather name="info" size={16} color={colors.lighter} />
              </View>
              <View style={styles.insightContent}>
                <View style={styles.iconBox}>
                  <Feather 
                    name="bar-chart-2" 
                    size={28} 
                    color={getColor(analysisData.volatility, analysisData.volatilityPositive)} 
                  />
                </View>
                <Text style={[
                  styles.insightValue,
                  { color: getColor(analysisData.volatility, analysisData.volatilityPositive) }
                ]}>
                  {analysisData.volatility}
                </Text>
              </View>
            </View>
          </View>

          {/* Second Row: Momentum Strength (Full Width) */}
          <View style={styles.insightsRow}>
            <View style={[styles.insightBox, styles.insightBoxFullWidth]}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightLabel}>Momentum Strength</Text>
                <Feather name="info" size={16} color={colors.lighter} />
              </View>
              <View style={styles.insightContentColumn}>
                <Text style={[
                  styles.insightValue,
                  { color: getColor(analysisData.momentum, analysisData.momentumPositive) }
                ]}>
                  {analysisData.momentum}
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${analysisData.momentumPercentage || 0}%`,
                        backgroundColor: getColor(analysisData.momentum, analysisData.momentumPositive)
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Third Row: Pattern Type (Full Width) */}
          <View style={styles.insightsRow}>
            <View style={[styles.insightBox, styles.insightBoxFullWidth]}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightLabel}>Pattern Type</Text>
                <Feather name="info" size={16} color={colors.lighter} />
              </View>
              <View style={styles.insightContent}>
                <View style={styles.iconBox}>
                  <Feather 
                    name="trending-up" 
                    size={28} 
                    color={getColor(analysisData.patternType, analysisData.patternPositive)} 
                  />
                </View>
                <Text style={[
                  styles.insightValue,
                  { color: getColor(analysisData.patternType, analysisData.patternPositive) }
                ]}>
                  {analysisData.patternType}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <Text style={styles.summaryText}>{analysisData.summary}</Text>
        </View>

        {/* Technical Indicators Section */}
        <View style={styles.technicalCard}>
          <Text style={styles.technicalTitle}>Technical Indicators</Text>
          <View style={styles.technicalGrid}>
            {analysisData.technicals.map((item, index) => (
              <View key={index} style={styles.technicalItem}>
                <Text style={styles.technicalLabel}>{item.label}</Text>
                <Text style={styles.technicalValue}>{item.value}</Text>
                <View style={[
                  styles.technicalBadge,
                  item.positive ? styles.technicalBadgePositive : styles.technicalBadgeNegative
                ]}>
                  <Text style={[
                    styles.technicalChange,
                    item.positive ? styles.technicalChangePositive : styles.technicalChangeNegative
                  ]}>
                    {item.change}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Fundamental Analysis Section */}
        <View style={styles.fundamentalsCard}>
          <Text style={styles.fundamentalsTitle}>Fundamental Analysis</Text>
          <View style={styles.fundamentalsList}>
            {analysisData.fundamentals.map((item, index) => (
              <View key={index} style={styles.newsItem}>
                <View style={styles.newsHeader}>
                  <View style={[
                    styles.sentimentBadge,
                    item.sentiment === 'bullish' ? styles.sentimentBullish : styles.sentimentBearish
                  ]}>
                    <Feather 
                      name={item.sentiment === 'bullish' ? 'trending-up' : 'trending-down'} 
                      size={14} 
                      color={item.sentiment === 'bullish' ? '#10B981' : '#EF4444'} 
                    />
                    <Text style={[
                      styles.sentimentText,
                      item.sentiment === 'bullish' ? styles.sentimentTextBullish : styles.sentimentTextBearish
                    ]}>
                      {item.sentiment.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.newsTime}>{item.time}</Text>
                </View>
                <View style={styles.newsTitleRow}>
                  <Feather name="file-text" size={16} color={colors.lighter} style={styles.sourceIcon} />
                  <Text style={styles.newsTitle}>{item.title}</Text>
                </View>
                <Text style={styles.newsDescription}>{item.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.lightest,
  },
  placeholder: {
    width: 40,
  },
  saveButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lighter + '20',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  chartImage: {
    width: '100%',
    height: 300,
  },
  symbolContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 16,
  },
  symbolBox: {
    flex: 1,
    backgroundColor: colors.darker,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lighter + '20',
  },
  symbolLabel: {
    fontSize: 14,
    color: colors.lighter,
    marginBottom: 8,
    fontWeight: '500',
  },
  symbolValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.lightest,
  },
  timeRangeBox: {
    flex: 1,
    backgroundColor: colors.darker,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lighter + '20',
  },
  timeRangeLabel: {
    fontSize: 14,
    color: colors.lighter,
    marginBottom: 8,
    fontWeight: '500',
  },
  timeRangeValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.lightest,
  },
  insightsCard: {
    backgroundColor: colors.darker,
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    borderColor: colors.lighter + '20',
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.lightest,
    marginBottom: 16,
    textAlign: 'left',
  },
  insightsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  insightBox: {
    width: '48%',       // or: flexBasis: '48%'
    // remove: flex: 1
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 16,
  },
  insightBoxFullWidth: {
    width: '100%',
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightLabel: {
    fontSize: 14,
    color: colors.lighter,
    fontWeight: '500',
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  insightContentColumn: {
    gap: 12,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.darker,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.lightest,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.darker,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.lighter,
    borderRadius: 4,
  },
  summaryCard: {
    backgroundColor: colors.darker,
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lighter + '20',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.lightest,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 15,
    color: colors.lighter,
    lineHeight: 24,
  },
  technicalCard: {
    backgroundColor: colors.darker,
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lighter + '20',
  },
  technicalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.lightest,
    marginBottom: 20,
  },
  technicalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  technicalItem: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lighter + '15',
  },
  technicalLabel: {
    fontSize: 12,
    color: colors.lighter,
    marginBottom: 8,
    fontWeight: '500',
  },
  technicalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.lightest,
    marginBottom: 8,
  },
  technicalBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  technicalBadgePositive: {
    backgroundColor: '#10B981' + '20',
  },
  technicalBadgeNegative: {
    backgroundColor: '#EF4444' + '20',
  },
  technicalChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  technicalChangePositive: {
    color: '#10B981',
  },
  technicalChangeNegative: {
    color: '#EF4444',
  },
  fundamentalsCard: {
    backgroundColor: colors.darker,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lighter + '20',
  },
  fundamentalsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.lightest,
    marginBottom: 20,
  },
  fundamentalsList: {
    gap: 16,
  },
  newsItem: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lighter + '15',
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sentimentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  sentimentBullish: {
    backgroundColor: '#10B981' + '20',
  },
  sentimentBearish: {
    backgroundColor: '#EF4444' + '20',
  },
  sentimentText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sentimentTextBullish: {
    color: '#10B981',
  },
  sentimentTextBearish: {
    color: '#EF4444',
  },
  newsTime: {
    fontSize: 12,
    color: colors.lighter,
    fontWeight: '500',
  },
  newsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourceIcon: {
    marginRight: 8,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.lightest,
    lineHeight: 22,
    flex: 1,
  },
  newsDescription: {
    fontSize: 14,
    color: colors.lighter,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40,
  },
});
