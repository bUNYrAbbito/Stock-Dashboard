import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css'


const STOCK_SYMBOLS = [
  "AAPL", "MSFT", "GOOGL", "TSLA", "AMZN", "NVDA", "FB", "NFLX"
];

export default function StockDashboard() {
  const [stockList, setStockList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

  useEffect(() => {

    async function loadStocks() {
      setIsLoading(true);
      setFetchError("");

      const tempList = [];

      try {
        for (const symbol of STOCK_SYMBOLS) {
          const response = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
          );

          tempList.push({
            symbol: symbol,
            currentPrice: response.data.c,
            changeValue: response.data.d,
            changePercent: response.data.dp
          });
        }

        setStockList(tempList);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setFetchError("Unable to fetch stock data. Please check your API key or internet connection.");
      } finally {
        setIsLoading(false);
      }
    }

    loadStocks();
  }, []);

  return (
    <div className="container">
      <h1 className="header">Stock Price Dashboard</h1>

      {isLoading && <p className="status-message">Loading stock data...</p>}
      {fetchError && <p className="status-message error">{fetchError}</p>}

      {!isLoading && !fetchError && (
        <table className="stock-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Price</th>
              <th>Change %</th>
            </tr>
          </thead>
          <tbody>
            {stockList.map((stock) => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.currentPrice ? `$${stock.currentPrice.toFixed(2)}` : "N/A"}</td>
                <td className={stock.changeValue >= 0 ? "positive" : "negative"}>
                  {stock.changePercent ? stock.changePercent.toFixed(2) + "%" : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
