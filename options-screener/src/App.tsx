import React, { useState } from "react";
import { fetchOptionsData, fetchHistoricalData, screenOptions, type OptionsFilters, type OptionsData, type ScreenerResult, type CandlestickData } from "./api";
import OptionsTable from "./components/OptionsTable";
import FilterForm from "./components/FilterForm";
import ScreenerForm from "./components/ScreenerForm";
import ScreenerResults from "./components/ScreenerResults";
import PriceChart from "./components/PriceChart";

type TabType = 'single' | 'screener';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('single');
  const [ticker, setTicker] = useState("");
  const [optionsData, setOptionsData] = useState<OptionsData | null>(null);
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [screenerResults, setScreenerResults] = useState<ScreenerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OptionsFilters>({
    ticker: "",
    minVolume: 0,
    minOpenInterest: 0,
    maxBidAskSpread: 10,
    includeGreeks: true
  });

  async function handleSearch() {
    if (!ticker.trim()) {
      setError("Please enter a ticker symbol.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchFilters = {
        ...filters,
        ticker: ticker.trim().toUpperCase()
      };
      
      // Fetch options data first
      const data = await fetchOptionsData(searchFilters);
      setOptionsData(data);
      
      // Then fetch historical data (don't fail if this fails)
      try {
        const historicalData = await fetchHistoricalData(ticker.trim().toUpperCase());
        setChartData(historicalData);
      } catch (chartErr: any) {
        console.warn('Failed to fetch chart data:', chartErr);
        setChartData([]);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || "Failed to fetch options data");
      setOptionsData(null);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleScreenerResults = (results: ScreenerResult[]) => {
    setScreenerResults(results);
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#333', 
        marginBottom: '30px',
        fontSize: '2.5em'
      }}>
        Options Screener
      </h1>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '30px',
        borderBottom: '2px solid #dee2e6'
      }}>
        <button
          onClick={() => setActiveTab('single')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: activeTab === 'single' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'single' ? 'white' : '#495057',
            border: 'none',
            borderBottom: activeTab === 'single' ? '2px solid #007bff' : 'none',
            cursor: 'pointer',
            borderRadius: '6px 6px 0 0'
          }}
        >
          Single Ticker Analysis
        </button>
        <button
          onClick={() => setActiveTab('screener')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: activeTab === 'screener' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'screener' ? 'white' : '#495057',
            border: 'none',
            borderBottom: activeTab === 'screener' ? '2px solid #007bff' : 'none',
            cursor: 'pointer',
            borderRadius: '6px 6px 0 0'
          }}
        >
          Multi-Ticker Screener
        </button>
      </div>

      {activeTab === 'single' ? (
        // Single Ticker Analysis Tab
        <div>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginBottom: '20px',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <input
              type="text"
              placeholder="Enter ticker (e.g. AAPL)"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              style={{
                padding: '12px 16px',
                fontSize: '16px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                width: '200px'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSearch} 
              disabled={loading}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>

          {error && (
            <div style={{ 
              color: 'white', 
              backgroundColor: '#dc3545', 
              padding: '12px', 
              borderRadius: '6px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Error: {error}
            </div>
          )}

          {optionsData && (
            <div>
              <div style={{ 
                backgroundColor: '#e9ecef', 
                padding: '15px', 
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                  {optionsData.ticker} - {new Date(optionsData.expiration).toLocaleDateString()}
                </h2>
                <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                  Current Price: ${optionsData.currentPrice}
                </p>
              </div>

              {/* Price Chart */}
              {chartData.length > 0 && (
                <PriceChart 
                  ticker={optionsData.ticker}
                  data={chartData}
                  currentPrice={optionsData.currentPrice}
                />
              )}

              <FilterForm 
                ticker={ticker}
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
                loading={loading}
              />

              <OptionsTable 
                title="Call Options" 
                options={optionsData.calls} 
                currentPrice={optionsData.currentPrice}
              />
              <OptionsTable 
                title="Put Options" 
                options={optionsData.puts} 
                currentPrice={optionsData.currentPrice}
              />
            </div>
          )}
        </div>
      ) : (
        // Multi-Ticker Screener Tab
        <div>
          <ScreenerForm 
            onResults={handleScreenerResults}
            loading={loading}
            setLoading={setLoading}
          />
          
          {screenerResults.length > 0 && (
            <ScreenerResults results={screenerResults} />
          )}
        </div>
      )}
    </div>
  );
}
