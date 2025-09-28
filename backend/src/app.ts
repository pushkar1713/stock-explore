import yahooFinance from "yahoo-finance2";

// const mostActive = await yahooFinance.screener({ scrIds: "most_actives" });
// const dailygainers = await yahooFinance.screener({
//   scrIds: "day_gainers",
//   count: 10,
// });
// const daily_loser = await yahooFinance.screener({
//   scrIds: "day_losers",
//   count: 10,
// });

const insights = await yahooFinance.search("AAPL");
console.log(insights);

// const results = await yahooFinance.quoteSummary("^NDX");
// console.log(results);

console.log("Most Active Stocks:");
// mostActive.quotes.forEach((stock: any) => {
//   console.log(stock);
//   const volume = (stock.regularMarketVolume / 1e6).toFixed(2);
//   console.log(`${stock.symbol}: ${volume}M shares traded`);
// });

// dailygainers.quotes.forEach((stock: any) => {
//   // console.log(stock);
//   const volume = (stock.regularMarketVolume / 1e6).toFixed(2);
//   console.log(`${stock.symbol}: ${volume}M shares traded`);
// });
