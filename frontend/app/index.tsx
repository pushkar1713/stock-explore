import { useState, useEffect } from "react";
import { Image, Pressable, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";

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

// ---------------------
// Mock Data (for other sections)
// ---------------------
const mockStocks = {
  gainers: [
    {
      symbol: "AAPL",
      exchange: "NasdaqGS",
      currentValue: 220.4,
      changePercent1D: 2.5,
    },
    {
      symbol: "MSFT",
      exchange: "NasdaqGS",
      currentValue: 380.9,
      changePercent1D: 1.2,
    },
    {
      symbol: "TSLA",
      exchange: "NasdaqGS",
      currentValue: 440.4,
      changePercent1D: 4.0,
    },
    {
      symbol: "AMZN",
      exchange: "NasdaqGS",
      currentValue: 150.2,
      changePercent1D: -0.5,
    },
    {
      symbol: "NVDA",
      exchange: "NasdaqGS",
      currentValue: 178.1,
      changePercent1D: 0.3,
    },
    {
      symbol: "GOOGL",
      exchange: "NasdaqGS",
      currentValue: 140.3,
      changePercent1D: 2.0,
    },
    {
      symbol: "META",
      exchange: "NasdaqGS",
      currentValue: 305.8,
      changePercent1D: 1.8,
    },
    {
      symbol: "NFLX",
      exchange: "NasdaqGS",
      currentValue: 505.2,
      changePercent1D: 3.1,
    },
    {
      symbol: "BABA",
      exchange: "NYSE",
      currentValue: 88.7,
      changePercent1D: -1.1,
    },
    {
      symbol: "ORCL",
      exchange: "NYSE",
      currentValue: 120.4,
      changePercent1D: 0.9,
    },
  ],
  losers: [
    {
      symbol: "XYZ",
      exchange: "NYSE",
      currentValue: 45.2,
      changePercent1D: -3.2,
    },
    {
      symbol: "ABC",
      exchange: "NasdaqGS",
      currentValue: 78.9,
      changePercent1D: -2.1,
    },
  ],
  active: [
    {
      symbol: "SPY",
      exchange: "NYSE",
      currentValue: 425.6,
      changePercent1D: 0.8,
    },
    {
      symbol: "QQQ",
      exchange: "NasdaqGS",
      currentValue: 355.2,
      changePercent1D: 1.1,
    },
  ],
};

const spotlightStock = {
  symbol: "NVDA",
  name: "NVIDIA Corporation",
  logo: "https://logo.clearbit.com/nvidia.com",
  currentValue: 178.1,
  changePercent1D: 0.3,
  description:
    "Leading designer of graphics processing units (GPUs) for gaming and professional markets, as well as system on chip units (SoCs) for mobile computing and automotive.",
};

const mockNews = [
  {
    title:
      "American Rebel Holdings, Inc. (AREB) Stabilizes Financial Position and Invests in Electric Motorcycle Innovator",
    date: "2025-09-26 18:00:04",
    author: "Gordon Thompson",
    site: "Financial Modeling Prep",
    image:
      "https://portal.financialmodelingprep.com/positions/68d6e347cd7a0ed06b2415c2.jpeg",
    link: "https://financialmodelingprep.com/market-news/american-rebel-holdings-secures-financing-invests-electric-motorcycle",
  },
  {
    title: "Tesla Announces New Gigafactory in Southeast Asia",
    date: "2025-09-26 15:30:00",
    author: "Sarah Mitchell",
    site: "Tech Daily",
    image: "https://picsum.photos/seed/tesla/400/300",
    link: "https://example.com/news/tesla-gigafactory",
  },
  {
    title: "Apple Unveils Revolutionary AI Chip for Next-Gen Devices",
    date: "2025-09-26 14:15:22",
    author: "John Davis",
    site: "Innovation News",
    image: "https://picsum.photos/seed/apple/400/300",
    link: "https://example.com/news/apple-ai-chip",
  },
  {
    title: "Federal Reserve Signals Potential Rate Cut in Q4 2025",
    date: "2025-09-26 12:45:10",
    author: "Emma Rodriguez",
    site: "Financial Times",
    image: "https://picsum.photos/seed/fed/400/300",
    link: "https://example.com/news/fed-rate-cut",
  },
  {
    title: "Microsoft and OpenAI Expand Partnership with $10B Investment",
    date: "2025-09-26 11:20:33",
    author: "David Chen",
    site: "Business Insider",
    image: "https://picsum.photos/seed/microsoft/400/300",
    link: "https://example.com/news/microsoft-openai",
  },
  {
    title: "Amazon Reports Record Q3 Earnings, Beats Expectations",
    date: "2025-09-26 10:05:18",
    author: "Lisa Wong",
    site: "Market Watch",
    image: "https://picsum.photos/seed/amazon/400/300",
    link: "https://example.com/news/amazon-earnings",
  },
  {
    title: "Google Launches New Cloud AI Platform for Enterprises",
    date: "2025-09-26 09:30:45",
    author: "Michael Brown",
    site: "Cloud Computing Today",
    image: "https://picsum.photos/seed/google/400/300",
    link: "https://example.com/news/google-cloud-ai",
  },
  {
    title: "Meta Introduces Advanced VR Headset with Brain-Computer Interface",
    date: "2025-09-26 08:15:27",
    author: "Jennifer Lee",
    site: "VR World",
    image: "https://picsum.photos/seed/meta/400/300",
    link: "https://example.com/news/meta-vr-headset",
  },
  {
    title: "Oil Prices Surge 5% on Middle East Tensions",
    date: "2025-09-26 07:00:55",
    author: "Robert Taylor",
    site: "Energy Daily",
    image: "https://picsum.photos/seed/oil/400/300",
    link: "https://example.com/news/oil-prices",
  },
  {
    title: "Netflix Announces Entry into Gaming Hardware Market",
    date: "2025-09-25 20:45:12",
    author: "Amanda White",
    site: "Entertainment Tech",
    image: "https://picsum.photos/seed/netflix/400/300",
    link: "https://example.com/news/netflix-gaming",
  },
  {
    title: "Bitcoin Reaches New All-Time High Above $75,000",
    date: "2025-09-25 19:30:08",
    author: "Chris Johnson",
    site: "Crypto News",
    image: "https://picsum.photos/seed/bitcoin/400/300",
    link: "https://example.com/news/bitcoin-ath",
  },
];

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
          <Text className="text-white/70 text-sm mt-2">Loading market data...</Text>
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
      {!loading && !error && indexes.map((item, i) => {
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
  const [active, setActive] = useState<(typeof tabs)[number]>("gainers");
  const [visible, setVisible] = useState(5);

  const data = mockStocks[active] || [];
  const visibleItems = data.slice(0, visible);

  const getTabLabel = (tab: (typeof tabs)[number]) => {
    const labels = {
      gainers: "Gainers",
      losers: "Losers",
      active: "Active",
    };
    return labels[tab];
  };

  return (
    <View className="bg-white/5 rounded-2xl p-5">
      {/* Tabs */}
      <View className="flex-row mb-6 bg-white/5 rounded-xl p-1">
        {tabs.map((tab) => {
          const isActive = active === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => {
                setActive(tab);
                setVisible(5);
              }}
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

      {/* Empty State */}
      {visibleItems.length === 0 && (
        <View className="py-8 items-center">
          <Text className="text-white/50 text-sm">No stocks available</Text>
        </View>
      )}

      {/* Rows */}
      {visibleItems.map((item, idx) => (
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
      {visible < data.length && (
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
  const isUp = spotlightStock.changePercent1D >= 0;
  const changePct = spotlightStock.changePercent1D.toFixed(2);

  return (
    <View className="bg-white/5 rounded-2xl p-5">
      <Text className="text-white text-xl font-semibold mb-4">
        Stock Spotlight
      </Text>

      <View className="flex-row items-start">
        {/* Logo */}
        <View className="h-16 w-16 rounded-xl bg-white items-center justify-center mr-4 overflow-hidden">
          <Image
            source={{ uri: spotlightStock.logo }}
            className="h-12 w-12"
            resizeMode="contain"
          />
        </View>

        {/* Info */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-white font-bold text-lg">
              {spotlightStock.symbol}
            </Text>
            <Text className="text-white font-semibold text-base">
              ${spotlightStock.currentValue.toFixed(2)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white/70 text-sm flex-1" numberOfLines={1}>
              {spotlightStock.name}
            </Text>
            <Text
              className={`text-sm font-semibold ml-2 ${
                isUp ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {isUp ? "+" : ""}
              {changePct}%
            </Text>
          </View>

          <Text className="text-white/60 text-sm leading-5">
            {spotlightStock.description}
          </Text>
        </View>
      </View>
    </View>
  );
}

function NewsSection() {
  const [visible, setVisible] = useState(5);

  const visibleNews = mockNews.slice(0, visible);

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

  const handleOpenLink = (link: string) => {
    // In React Native, you'd use Linking.openURL(link)
    console.log("Opening:", link);
  };

  return (
    <View className="bg-white/5 rounded-2xl p-5">
      <Text className="text-white text-xl font-semibold mb-4">Market News</Text>

      {/* News Items */}
      {visibleNews.map((item, idx) => {
        const isLast =
          idx === visibleNews.length - 1 && visible >= mockNews.length;
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
      {visible < mockNews.length && (
        <Pressable
          onPress={() => setVisible((v) => v + 5)}
          className="mt-4 py-3 px-4 rounded-xl bg-white/10 items-center border border-white/10"
        >
          <Text className="text-white font-medium text-sm">
            View More ({mockNews.length - visible} remaining)
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
