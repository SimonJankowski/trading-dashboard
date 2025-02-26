"use client";

import { useEffect, useRef } from "react";
import { CandlestickSeries, createChart, CandlestickData, ISeriesApi, IChartApi } from "lightweight-charts";
import { LatestCandle } from "@/types";

interface TradingChartProps {
  ohlcvData: CandlestickData[];
  latestCandle: LatestCandle | null;
}

export default function TradingChart({ ohlcvData, latestCandle }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 350,
      layout: {
        background: { color: "#111827" },
        textColor: "#ffffff",
      },
      grid: {
        vertLines: { color: "#2d3748" },
        horzLines: { color: "#2d3748" },
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    candlestickSeries.setData(ohlcvData);
    candlestickSeriesRef.current = candlestickSeries;
    chartRef.current = chart;

    return () => chart.remove();
  }, [ohlcvData]);

  useEffect(() => {
    if (candlestickSeriesRef.current && latestCandle) {
      if (!ohlcvData.some((candle) => candle.time === latestCandle.time)) {
        candlestickSeriesRef.current.update(latestCandle);
      }
    }
  }, [latestCandle, ohlcvData]);

  return (
    <div className="w-full h-[350px] bg-gray-800 p-4 rounded-lg shadow">
      <div ref={chartContainerRef} className="w-full h-80" />
    </div>
  );
}
