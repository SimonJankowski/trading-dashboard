"use client";

import { useEffect, useState } from "react";
import { fetchOHLCV } from "../utils/binance";
import {
  useBinanceOHLCV,
  useBinanceLivePrice,
  useBinanceOrderBook,
} from "../hooks/useWebSocket";
import TradingChart from "@/components/TradingChart";
import OrderBook from "@/components/OrderBook";
import { TRADING_PAIRS, TIMEFRAMES } from "@/config";
import { OHLCVData } from "@/types";

export default function Home() {
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1m");

  const [isLoading, setIsLoading] = useState(true);
  const [ohlcvData, setOhlcvData] = useState<OHLCVData[]>([]);

  const price = useBinanceLivePrice(selectedPair.toLowerCase());
  const latestCandle = useBinanceOHLCV(selectedPair.toLowerCase(), selectedTimeframe);
  const { orderBook, isReady: isOrderBookReady } = useBinanceOrderBook(selectedPair.toLowerCase());

  const handleSelectionChange = (type: "pair" | "timeframe", value: string) => {
    setIsLoading(true);
    setOhlcvData([]);

    if (type === "pair") {
      setSelectedPair(value);
    } else {
      setSelectedTimeframe(value);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const historicalData = await fetchOHLCV(selectedPair, selectedTimeframe);
      setOhlcvData(historicalData);
      setIsLoading(false);
    }
    fetchData();
  }, [selectedPair, selectedTimeframe]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold">Crypto Trading Dashboard</h1>
      <p className="text-gray-400 mt-2">Real-time market data from Binance</p>

      <div className="mt-2 p-2 text-sm bg-gray-800 text-gray-300 rounded-lg">
        WebSocket Status:
        <span className={`ml-2 ${price ? "text-green-400" : "text-red-400"}`}>
          {price ? "Connected ✅" : "Disconnected ❌"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap md:flex-nowrap items-center justify-between w-full max-w-4xl bg-gray-800 p-4 rounded-lg shadow">
        <div>
          <label className="text-sm text-gray-400">Trading Pair:</label>
          <select
            className="ml-2 bg-gray-700 text-white p-2 rounded-lg"
            value={selectedPair}
            onChange={(e) => handleSelectionChange("pair", e.target.value)}
          >
            {TRADING_PAIRS.map((pair) => (
              <option key={pair} value={pair}>
                {pair.replace("USDT", "/USDT")}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-gray-700 p-2 rounded-lg text-center text-green-400 font-bold min-w-[120px]">
          {price !== null ? `$${price.toFixed(2)}` : "Loading..."}
        </div>
        <div>
          <label className="text-sm text-gray-400">Timeframe:</label>
          <select
            className="ml-2 bg-gray-700 text-white p-2 rounded-lg"
            value={selectedTimeframe}
            onChange={(e) => handleSelectionChange("timeframe", e.target.value)}
          >
            {TIMEFRAMES.map((timeframe) => (
              <option key={timeframe} value={timeframe}>
                {timeframe.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full max-w-4xl mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Price Chart ({selectedTimeframe.toUpperCase()})</h2>
          {isLoading ? <p className="text-gray-500 text-center mt-4">Loading...</p> : <TradingChart ohlcvData={ohlcvData} latestCandle={latestCandle} />}
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Order Book</h2>
          {!isOrderBookReady ? <p className="text-gray-500 text-center mt-4">Loading...</p> : <OrderBook bids={orderBook.bids} asks={orderBook.asks} />}
        </div>
      </div>
    </div>
  );
}
