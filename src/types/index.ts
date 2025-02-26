import { CandlestickData } from "lightweight-charts";
export interface OHLCVData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

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

export type LatestCandle = CandlestickData & { volume: number };
