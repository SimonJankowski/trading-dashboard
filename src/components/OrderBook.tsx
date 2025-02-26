"use client";
import { OrderBookData } from "@/types";

export default function OrderBook({ bids, asks }: OrderBookData ) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow w-full">
      <h2 className="text-lg font-semibold mb-2">Order Book</h2>

      <div className="grid grid-cols-2 text-sm">
        <div className="border-r border-gray-600 pr-2">
          <h3 className="text-red-400 mb-1">Asks</h3>
          <ul>
            {asks.map(([price, amount], index) => (
              <li
                key={index}
                className="flex justify-between px-2 py-1 text-red-300 relative"
              >
                <span>{parseFloat(price).toFixed(2)}</span>
                <span>{parseFloat(amount).toFixed(4)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pl-2">
          <h3 className="text-green-400 mb-1">Bids</h3>
          <ul>
            {bids.map(([price, amount], index) => (
              <li
                key={index}
                className="flex justify-between px-2 py-1 text-green-300 relative"
              >
                <span>{parseFloat(price).toFixed(2)}</span>
                <span>{parseFloat(amount).toFixed(4)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
