import { CandlestickData } from "lightweight-charts";

export interface OrderBookData {
  bids: [string, string][];
  asks: [string, string][];
}

export interface LiveTrade {
  price: number;
}

export type BinanceOHLCVResponse = [
  number,
  string,
  string,
  string,
  string,
  string,
  ...unknown[]
];

export type LatestCandle = OHLCVData | null;

export interface OHLCVData extends CandlestickData {
  volume: number;
}



