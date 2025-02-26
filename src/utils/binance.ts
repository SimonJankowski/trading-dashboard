import { BINANCE_API_URL } from "@/config";
import { BinanceOHLCVResponse } from "@/types";

export async function fetchOHLCV(symbol = "BTCUSDT", interval = "1m", limit = 50) {
  try {
    const response = await fetch(
      `${BINANCE_API_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    const data: BinanceOHLCVResponse[] = await response.json();

    return data.map((candle) => ({
      time: candle[0] / 1000,
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5]),
    }));
  } catch (error) {
    console.error("Error fetching OHLCV data:", error);
    return [];
  }
}
