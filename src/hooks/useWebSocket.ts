import { useEffect, useRef, useState } from "react";
import { BINANCE_WS_URL } from "@/config";
import { OrderBookData, OHLCVData, LatestCandle } from "@/types";

export function useBinanceLivePrice(symbol = "btcusdt") {
  const [price, setPrice] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`${BINANCE_WS_URL}/${symbol.toLowerCase()}@trade`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(parseFloat(data.p));
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);

    ws.onclose = () => {
      if (wsRef.current === ws) {
        wsRef.current = null;
      }
    };

    return () => ws.close();
  }, [symbol]);

  return price;
}

export function useBinanceOHLCV(symbol = "btcusdt", interval = "1m") {
  const [latestCandle, setLatestCandle] = useState<LatestCandle | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`${BINANCE_WS_URL}/${symbol.toLowerCase()}@kline_${interval}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const candle = data.k;
      setLatestCandle({
        time: candle.t / 1000,
        open: parseFloat(candle.o),
        high: parseFloat(candle.h),
        low: parseFloat(candle.l),
        close: parseFloat(candle.c),
        volume: parseFloat(candle.v),
      });
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);

    ws.onclose = () => {
      if (wsRef.current === ws) {
        wsRef.current = null;
      }
    };

    return () => ws.close();
  }, [symbol, interval]);

  return latestCandle;
}


export function useBinanceOrderBook(symbol: string) {
  const [orderBook, setOrderBook] = useState<OrderBookData>({ bids: [], asks: [] });
  const [isReady, setIsReady] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    setIsReady(false);
    setOrderBook({ bids: [], asks: [] });

    const ws = new WebSocket(`${BINANCE_WS_URL}/${symbol.toLowerCase()}@depth10@1000ms`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setOrderBook({
        bids: data.bids.slice(0, 10),
        asks: data.asks.slice(0, 10),
      });
      setIsReady(true);
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);

    ws.onclose = () => {
      if (wsRef.current === ws) {
        wsRef.current = null;
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [symbol]);

  return { orderBook, isReady };
}
