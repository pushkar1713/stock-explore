import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ---------------------
// Types
// ---------------------
interface IndexData {
  name: string;
  symbol: string;
  currentValue: number;
  changePercent1D: number;
  changeAbs: number;
  marketState: string;
}

interface ActiveStockData {
  name: string;
  exchange: string;
  symbol: string;
  currentValue: number;
  changePercent1D: number;
  changeAbs: number;
  volume: string;
}

interface SpotlightData {
  symbol: string;
  price: number;
  marketCap: number;
  beta: number;
  lastDividend: number;
  range: string;
  change: number;
  changePercentage: number;
  volume: number;
  averageVolume: number;
  companyName: string;
  currency: string;
  cik: string;
  isin: string;
  cusip: string;
  exchangeFullName: string;
  exchange: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  image: string;
  ipoDate: string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}

interface NewsData {
  title: string;
  date: string;
  content: string;
  tickers: string;
  image: string;
  link: string;
  author: string;
  site: string;
}

interface ApiResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
}

// ---------------------
// API Functions
// ---------------------
const fetchIndexes = async (): Promise<IndexData[]> => {
  try {
    const response = await axios.get<ApiResponse<IndexData[]>>(
      "https://stock-explore-six.vercel.app/api/v1/indexes"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching indexes:", error);
    throw error;
  }
};

const fetchActiveStocks = async (): Promise<ActiveStockData[]> => {
  try {
    const response = await axios.get<ApiResponse<ActiveStockData[]>>(
      "https://stock-explore-six.vercel.app/api/v1/active"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching active stocks:", error);
    throw error;
  }
};

const fetchGainerStocks = async (): Promise<ActiveStockData[]> => {
  try {
    const response = await axios.get<ApiResponse<ActiveStockData[]>>(
      "https://stock-explore-six.vercel.app/api/v1/gainers"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching gainer stocks:", error);
    throw error;
  }
};

const fetchLoserStocks = async (): Promise<ActiveStockData[]> => {
  try {
    const response = await axios.get<ApiResponse<ActiveStockData[]>>(
      "https://stock-explore-six.vercel.app/api/v1/losers"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching loser stocks:", error);
    throw error;
  }
};

const fetchSpotlightStock = async (): Promise<SpotlightData> => {
  try {
    const response = await axios.get<ApiResponse<SpotlightData[]>>(
      "https://stock-explore-six.vercel.app/api/v1/spotlight"
    );
    return response.data.data[0]; // Return first item from array
  } catch (error) {
    console.error("Error fetching spotlight stock:", error);
    throw error;
  }
};

const fetchNews = async (): Promise<NewsData[]> => {
  try {
    const response = await axios.get<ApiResponse<NewsData[]>>(
      "https://stock-explore-six.vercel.app/api/v1/news"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

// ---------------------
// Components
// ---------------------

function MarketSnapshot() {
  const [indexes, setIndexes] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIndexes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchIndexes();
        setIndexes(data);
      } catch (err) {
        setError("Failed to load market data");
        console.error("Error loading indexes:", err);
      } finally {
        setLoading(false);
      }
    };

    loadIndexes();
  }, []);

  return (
    <View className="bg-white/5 rounded-2xl p-5">
      <Text className="text-white text-xl font-semibold mb-3">
        Market Snapshot
      </Text>

      {/* Table header */}
      <View className="flex-row items-center border-b border-white/10 pb-3 mb-2">
        <Text className="flex-1 text-white/70 text-sm font-medium">Index</Text>
        <Text className="text-right text-white/70 text-sm font-medium w-24">
          Value & Change
        </Text>
      </View>

      {/* Loading State */}
      {loading && (
        <View className="py-8 items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white/70 text-sm mt-2">
            Loading market data...
          </Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View className="py-8 items-center">
          <Text className="text-rose-400 text-sm mb-2">{error}</Text>
          <Pressable
            onPress={() => {
              const loadIndexes = async () => {
                try {
                  setLoading(true);
                  setError(null);
                  const data = await fetchIndexes();
                  setIndexes(data);
                } catch (err) {
                  setError("Failed to load market data");
                } finally {
                  setLoading(false);
                }
              };
              loadIndexes();
            }}
            className="px-4 py-2 bg-white/10 rounded-lg"
          >
            <Text className="text-white text-sm">Retry</Text>
          </Pressable>
        </View>
      )}

      {/* Data Rows */}
      {!loading &&
        !error &&
        indexes.map((item, i) => {
          const changePct = (item.changePercent1D * 100).toFixed(2);
          const isUp = item.changePercent1D >= 0;
          const isLast = i === indexes.length - 1;

          return (
            <View
              key={item.symbol}
              className={`flex-row items-center py-3 ${
                isLast ? "" : "border-b border-white/5"
              }`}
            >
              <View className="flex-1 pr-3">
                <Text className="text-white font-medium" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="text-white/60 text-xs mt-0.5">
                  {item.symbol}
                </Text>
              </View>
              <View className="items-end w-24">
                <Text className="text-white text-sm font-medium">
                  {item.currentValue.toLocaleString()}
                </Text>
                <Text
                  className={`text-xs font-semibold ${
                    isUp ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isUp ? "+" : ""}
                  {changePct}%
                </Text>
              </View>
            </View>
          );
        })}
    </View>
  );
}

function StockRow({
  symbol,
  exchange,
  price,
  change,
  isLast,
}: {
  symbol: string;
  exchange: string;
  price: number;
  change: number;
  isLast: boolean;
}) {
  const isUp = change >= 0;
  return (
    <View
      className={`flex-row items-center py-3 ${
        isLast ? "" : "border-b border-white/5"
      }`}
    >
      <View className="flex-1 pr-2">
        <Text className="text-white font-medium text-base" numberOfLines={1}>
          {symbol}
        </Text>
        <Text className="text-white/60 text-xs mt-0.5" numberOfLines={1}>
          {exchange}
        </Text>
      </View>
      <View className="items-end w-20">
        <Text className="text-white text-sm font-medium">
          ${price.toFixed(2)}
        </Text>
        <Text
          className={`text-xs font-semibold ${
            isUp ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {isUp ? "+" : ""}
          {change.toFixed(2)}%
        </Text>
      </View>
    </View>
  );
}

function StockLists() {
  const tabs = ["gainers", "losers", "active"] as const;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("gainers");
  const [visible, setVisible] = useState(5);

  // State for all three tabs
  const [gainersData, setGainersData] = useState<ActiveStockData[]>([]);
  const [losersData, setLosersData] = useState<ActiveStockData[]>([]);
  const [activeStocks, setActiveStocks] = useState<ActiveStockData[]>([]);

  // Loading states
  const [loadingGainers, setLoadingGainers] = useState(false);
  const [loadingLosers, setLoadingLosers] = useState(false);
  const [loadingActive, setLoadingActive] = useState(false);

  // Error states
  const [errorGainers, setErrorGainers] = useState<string | null>(null);
  const [errorLosers, setErrorLosers] = useState<string | null>(null);
  const [errorActive, setErrorActive] = useState<string | null>(null);

  // Load data when tab is selected
  useEffect(() => {
    const loadData = async () => {
      try {
        if (activeTab === "gainers" && gainersData.length === 0) {
          setLoadingGainers(true);
          setErrorGainers(null);
          const data = await fetchGainerStocks();
          setGainersData(data);
        } else if (activeTab === "losers" && losersData.length === 0) {
          setLoadingLosers(true);
          setErrorLosers(null);
          const data = await fetchLoserStocks();
          setLosersData(data);
        } else if (activeTab === "active" && activeStocks.length === 0) {
          setLoadingActive(true);
          setErrorActive(null);
          const data = await fetchActiveStocks();
          setActiveStocks(data);
        }
      } catch (err) {
        const errorMessage = `Failed to load ${activeTab} stocks`;
        if (activeTab === "gainers") setErrorGainers(errorMessage);
        else if (activeTab === "losers") setErrorLosers(errorMessage);
        else if (activeTab === "active") setErrorActive(errorMessage);
        console.error(`Error loading ${activeTab} stocks:`, err);
      } finally {
        if (activeTab === "gainers") setLoadingGainers(false);
        else if (activeTab === "losers") setLoadingLosers(false);
        else if (activeTab === "active") setLoadingActive(false);
      }
    };

    loadData();
  }, [activeTab, gainersData.length, losersData.length, activeStocks.length]);

  // Get data based on active tab
  const getData = () => {
    const stocksData = {
      gainers: gainersData,
      losers: losersData,
      active: activeStocks,
    };

    return stocksData[activeTab].map((stock) => ({
      symbol: stock.symbol,
      exchange: stock.exchange,
      currentValue: stock.currentValue,
      changePercent1D: stock.changePercent1D,
    }));
  };

  const data = getData();
  const visibleItems = data.slice(0, visible);

  const getTabLabel = (tab: (typeof tabs)[number]) => {
    const labels = {
      gainers: "Gainers",
      losers: "Losers",
      active: "Active",
    };
    return labels[tab];
  };

  const handleTabPress = (tab: (typeof tabs)[number]) => {
    setActiveTab(tab);
    setVisible(5);
  };

  const retryLoad = async (tab: (typeof tabs)[number]) => {
    try {
      if (tab === "gainers") {
        setLoadingGainers(true);
        setErrorGainers(null);
        const data = await fetchGainerStocks();
        setGainersData(data);
        setLoadingGainers(false);
      } else if (tab === "losers") {
        setLoadingLosers(true);
        setErrorLosers(null);
        const data = await fetchLoserStocks();
        setLosersData(data);
        setLoadingLosers(false);
      } else if (tab === "active") {
        setLoadingActive(true);
        setErrorActive(null);
        const data = await fetchActiveStocks();
        setActiveStocks(data);
        setLoadingActive(false);
      }
    } catch (err) {
      const errorMessage = `Failed to load ${tab} stocks`;
      if (tab === "gainers") {
        setErrorGainers(errorMessage);
        setLoadingGainers(false);
      } else if (tab === "losers") {
        setErrorLosers(errorMessage);
        setLoadingLosers(false);
      } else if (tab === "active") {
        setErrorActive(errorMessage);
        setLoadingActive(false);
      }
    }
  };

  // Get current loading and error states
  const getCurrentStates = () => {
    if (activeTab === "gainers") {
      return {
        isLoading: loadingGainers,
        hasError: errorGainers && !loadingGainers,
        error: errorGainers,
      };
    } else if (activeTab === "losers") {
      return {
        isLoading: loadingLosers,
        hasError: errorLosers && !loadingLosers,
        error: errorLosers,
      };
    } else {
      return {
        isLoading: loadingActive,
        hasError: errorActive && !loadingActive,
        error: errorActive,
      };
    }
  };

  const { isLoading, hasError, error } = getCurrentStates();

  return (
    <View className="bg-white/5 rounded-2xl p-5">
      {/* Tabs */}
      <View className="flex-row mb-6 bg-white/5 rounded-xl p-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => handleTabPress(tab)}
              className={`flex-1 py-3 px-2 rounded-lg items-center ${
                isActive ? "bg-white/15" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isActive ? "text-white" : "text-white/70"
                }`}
                numberOfLines={1}
              >
                {getTabLabel(tab)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Header */}
      <View className="flex-row items-center border-b border-white/10 pb-3 mb-2">
        <Text className="flex-1 text-white/70 text-sm font-medium">Stock</Text>
        <Text className="text-right text-white/70 text-sm font-medium w-20">
          Price & Change
        </Text>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="py-8 items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white/70 text-sm mt-2">
            Loading {activeTab} stocks...
          </Text>
        </View>
      )}

      {/* Error State */}
      {hasError && (
        <View className="py-8 items-center">
          <Text className="text-rose-400 text-sm mb-2">{error}</Text>
          <Pressable
            onPress={() => retryLoad(activeTab)}
            className="px-4 py-2 bg-white/10 rounded-lg"
          >
            <Text className="text-white text-sm">Retry</Text>
          </Pressable>
        </View>
      )}

      {/* Empty State */}
      {!isLoading && !hasError && visibleItems.length === 0 && (
        <View className="py-8 items-center">
          <Text className="text-white/50 text-sm">No stocks available</Text>
        </View>
      )}

      {/* Rows */}
      {!isLoading &&
        !hasError &&
        visibleItems.map((item, idx) => (
          <StockRow
            key={`${item.symbol}-${idx}`}
            symbol={item.symbol}
            exchange={item.exchange}
            price={item.currentValue}
            change={item.changePercent1D}
            isLast={idx === visibleItems.length - 1 && visible >= data.length}
          />
        ))}

      {/* View More */}
      {!isLoading && !hasError && visible < data.length && (
        <Pressable
          onPress={() => setVisible((v) => v + 5)}
          className="mt-4 py-3 px-4 rounded-xl bg-white/10 items-center border border-white/10"
        >
          <Text className="text-white font-medium text-sm">
            View More ({data.length - visible} remaining)
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function StockSpotlight() {
  const [spotlightData, setSpotlightData] = useState<SpotlightData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSpotlightData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSpotlightStock();
        setSpotlightData(data);
      } catch (err) {
        setError("Failed to load spotlight stock");
        console.error("Error loading spotlight stock:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSpotlightData();
  }, []);

  return (
    <View className="bg-white/5 rounded-2xl p-5">
      <Text className="text-white text-xl font-semibold mb-4">
        Stock Spotlight
      </Text>

      {/* Loading State */}
      {loading && (
        <View className="py-8 items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white/70 text-sm mt-2">
            Loading spotlight stock...
          </Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View className="py-8 items-center">
          <Text className="text-rose-400 text-sm mb-2">{error}</Text>
          <Pressable
            onPress={async () => {
              try {
                setLoading(true);
                setError(null);
                const data = await fetchSpotlightStock();
                setSpotlightData(data);
              } catch (err) {
                setError("Failed to load spotlight stock");
              } finally {
                setLoading(false);
              }
            }}
            className="px-4 py-2 bg-white/10 rounded-lg"
          >
            <Text className="text-white text-sm">Retry</Text>
          </Pressable>
        </View>
      )}

      {/* Data Display */}
      {!loading && !error && spotlightData && (
        <View className="flex-row items-start">
          {/* Logo */}
          <View className="h-16 w-16 rounded-xl bg-white items-center justify-center mr-4 overflow-hidden">
            <Image
              source={{ uri: spotlightData.image }}
              className="h-12 w-12"
              resizeMode="contain"
            />
          </View>

          {/* Info */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-white font-bold text-lg">
                {spotlightData.symbol}
              </Text>
              <Text className="text-white font-semibold text-base">
                ${spotlightData.price.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white/70 text-sm flex-1" numberOfLines={1}>
                {spotlightData.companyName}
              </Text>
              <Text
                className={`text-sm font-semibold ml-2 ${
                  spotlightData.changePercentage >= 0
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {spotlightData.changePercentage >= 0 ? "+" : ""}
                {spotlightData.changePercentage.toFixed(2)}%
              </Text>
            </View>

            <Text className="text-white/60 text-sm leading-5" numberOfLines={3}>
              {spotlightData.description}
            </Text>

            {/* Additional Info */}
            <View className="flex-row items-center mt-3 space-x-4">
              <View className="flex-1">
                <Text className="text-white/50 text-xs">Market Cap</Text>
                <Text className="text-white text-sm font-medium">
                  ${(spotlightData.marketCap / 1000000).toFixed(1)}M
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-white/50 text-xs">Volume</Text>
                <Text className="text-white text-sm font-medium">
                  {(spotlightData.volume / 1000000).toFixed(1)}M
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-white/50 text-xs">Industry</Text>
                <Text
                  className="text-white text-sm font-medium"
                  numberOfLines={1}
                >
                  {spotlightData.industry}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function NewsSection() {
  const [visible, setVisible] = useState(5);
  const [newsData, setNewsData] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchNews();
        setNewsData(data);
      } catch (err) {
        setError("Failed to load news");
        console.error("Error loading news:", err);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const visibleNews = newsData.slice(0, visible);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays}d ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours}h ago`;
    } else {
      const diffInMins = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMins}m ago`;
    }
  };

  const handleOpenLink = async (link: string) => {
    try {
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        await Linking.openURL(link);
      } else {
        console.error("Don't know how to open URI: " + link);
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  const retryLoad = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNews();
      setNewsData(data);
    } catch (err) {
      setError("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-white/5 rounded-2xl p-5">
      <Text className="text-white text-xl font-semibold mb-4">Market News</Text>

      {/* Loading State */}
      {loading && (
        <View className="py-8 items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white/70 text-sm mt-2">Loading news...</Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View className="py-8 items-center">
          <Text className="text-rose-400 text-sm mb-2">{error}</Text>
          <Pressable
            onPress={retryLoad}
            className="px-4 py-2 bg-white/10 rounded-lg"
          >
            <Text className="text-white text-sm">Retry</Text>
          </Pressable>
        </View>
      )}

      {/* News Items */}
      {!loading &&
        !error &&
        visibleNews.map((item, idx) => {
          const isLast =
            idx === visibleNews.length - 1 && visible >= newsData.length;
          return (
            <Pressable
              key={idx}
              onPress={() => handleOpenLink(item.link)}
              className={`py-4 ${isLast ? "" : "border-b border-white/5"}`}
            >
              <View className="flex-row">
                {/* Thumbnail */}
                <View className="w-20 h-20 rounded-lg overflow-hidden bg-white/10 mr-3">
                  <Image
                    source={{ uri: item.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>

                {/* Content */}
                <View className="flex-1">
                  <Text
                    className="text-white font-medium text-base leading-5 mb-2"
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>

                  <View className="flex-row items-center">
                    <Text className="text-white/50 text-xs" numberOfLines={1}>
                      {item.site}
                    </Text>
                    <Text className="text-white/30 text-xs mx-1.5">•</Text>
                    <Text className="text-white/50 text-xs">
                      {formatTimeAgo(item.date)}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}

      {/* View More */}
      {!loading && !error && visible < newsData.length && (
        <Pressable
          onPress={() => setVisible((v) => v + 5)}
          className="mt-4 py-3 px-4 rounded-xl bg-white/10 items-center border border-white/10"
        >
          <Text className="text-white font-medium text-sm">
            View More ({newsData.length - visible} remaining)
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// ---------------------
// Main Screen
// ---------------------
export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView className="flex-1 bg-zinc-950">
      <View
        className="mx-4 gap-6 pb-8"
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 32,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white text-2xl font-bold">Explore</Text>
          <Pressable className="h-10 w-10 rounded-full bg-white/10 items-center justify-center overflow-hidden">
            <Image
              source={{ uri: "https://i.pravatar.cc/100" }}
              className="h-full w-full"
            />
          </Pressable>
        </View>

        {/* Market Snapshot */}
        <MarketSnapshot />

        {/* Stock Lists */}
        <StockLists />

        {/* Stock Spotlight */}
        <StockSpotlight />

        {/* Market News */}
        <NewsSection />
      </View>
    </ScrollView>
  );
}
