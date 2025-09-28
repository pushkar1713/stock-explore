import yahooFinance from "yahoo-finance2";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const FMP_API_KEY = process.env.FMP_API_KEY;
const FMP_NEWS_BASE_URL = `https://financialmodelingprep.com/stable/fmp-articles?page=0&limit=20&apikey=${FMP_API_KEY}`;

export const stockService: any = {
  async getIndexesInfo() {
    const indexes = [
      "^GSPC",
      "^DJI",
      "^NDX",
      "^IXIC",
      "^RUT",
      "^FTSE",
      "^N225",
      "^HSI",
    ];

    const results = await Promise.all(
      indexes.map((index) => yahooFinance.quoteSummary(index))
    );

    const finalResults = results.map((result) => ({
      name: result.price?.shortName,
      symbol: result.price?.symbol,
      currentValue: result.price?.regularMarketPrice,
      changePercent1D: result.price?.regularMarketChangePercent,
      changeAbs: result.price?.regularMarketChange,
      marketState: result.price?.marketState,
    }));

    return finalResults;
  },

  async getGainersInfo() {
    const dailyGainers = await yahooFinance.screener({
      scrIds: "day_gainers",
      count: 10,
    });

    const results = dailyGainers.quotes.map((stock: any) => ({
      name: stock.shortName,
      exchange: stock.fullExchangeName,
      symbol: stock.symbol,
      currentValue: stock.regularMarketPrice,
      changePercent1D: stock.regularMarketChangePercent,
      changeAbs: stock.regularMarketChange,
      volume: (stock.regularMarketVolume / 1e6).toFixed(2),
    }));

    return results;
  },

  async getLosersInfo() {
    const dailyLosers = await yahooFinance.screener({
      scrIds: "day_losers",
      count: 10,
    });

    const results = dailyLosers.quotes.map((stock: any) => ({
      name: stock.shortName,
      exchange: stock.fullExchangeName,
      symbol: stock.symbol,
      currentValue: stock.regularMarketPrice,
      changePercent1D: stock.regularMarketChangePercent,
      changeAbs: stock.regularMarketChange,
      volume: (stock.regularMarketVolume / 1e6).toFixed(2),
    }));

    return results;
  },

  async getMostActiveInfo() {
    const mostActive = await yahooFinance.screener({
      scrIds: "most_actives",
      count: 10,
    });

    const results = mostActive.quotes.map((stock: any) => ({
      name: stock.shortName,
      exchange: stock.fullExchangeName,
      symbol: stock.symbol,
      currentValue: stock.regularMarketPrice,
      changePercent1D: stock.regularMarketChangePercent,
      changeAbs: stock.regularMarketChange,
      volume: (stock.regularMarketVolume / 1e6).toFixed(2),
    }));

    return results;
  },

  async getSpotlight() {
    const trending = await yahooFinance.trendingSymbols("US");
    const sym = trending.quotes[0]?.symbol as string;
    const FMP_INFO_BASE_URL = `https://financialmodelingprep.com/stable/profile?symbol=${sym}&apikey=${FMP_API_KEY}`;
    const result = await axios.get(FMP_INFO_BASE_URL);
    return result.data;
  },

  async getNews() {
    const news = await axios.get(FMP_NEWS_BASE_URL);
    return news.data;
  },
};
