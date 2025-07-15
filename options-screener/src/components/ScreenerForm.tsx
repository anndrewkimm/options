import React, { useState } from 'react';
import { screenOptions, type ScreenerFilters, type ScreenerResult } from '../api';

type ScreenerFormProps = {
  onResults: (results: ScreenerResult[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export default function ScreenerForm({ onResults, loading, setLoading }: ScreenerFormProps) {
  const [filters, setFilters] = useState<ScreenerFilters>({
    tickers: [],
    minVolume: 100,
    minOpenInterest: 50,
    maxBidAskSpread: 10,
    optionType: 'both'
  });
  const [tickerInput, setTickerInput] = useState('');

  const handleAddTicker = () => {
    if (tickerInput.trim() && !filters.tickers.includes(tickerInput.trim().toUpperCase())) {
      setFilters(prev => ({
        ...prev,
        tickers: [...prev.tickers, tickerInput.trim().toUpperCase()]
      }));
      setTickerInput('');
    }
  };

  const handleRemoveTicker = (tickerToRemove: string) => {
    setFilters(prev => ({
      ...prev,
      tickers: prev.tickers.filter(t => t !== tickerToRemove)
    }));
  };

  const handleScreenerSearch = async () => {
    if (filters.tickers.length === 0) {
      alert('Please add at least one ticker');
      return;
    }

    setLoading(true);
    try {
      const results = await screenOptions(filters);
      onResults(results);
    } catch (error: any) {
      alert(`Screener error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: '20px', 
      borderRadius: '8px', 
      marginBottom: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>Multi-Ticker Screener</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Add ticker (e.g. AAPL)"
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTicker()}
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <button 
            onClick={handleAddTicker}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>
        
        {filters.tickers.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {filters.tickers.map((ticker) => (
              <span 
                key={ticker}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {ticker}
                <button
                  onClick={() => handleRemoveTicker(ticker)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '0',
                    marginLeft: '5px'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div>
          <label>Min Volume:</label>
          <input
            type="number"
            value={filters.minVolume}
            onChange={(e) => setFilters(prev => ({ ...prev, minVolume: parseInt(e.target.value) || 0 }))}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>Min Open Interest:</label>
          <input
            type="number"
            value={filters.minOpenInterest}
            onChange={(e) => setFilters(prev => ({ ...prev, minOpenInterest: parseInt(e.target.value) || 0 }))}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>Max Bid-Ask Spread (%):</label>
          <input
            type="number"
            value={filters.maxBidAskSpread}
            onChange={(e) => setFilters(prev => ({ ...prev, maxBidAskSpread: parseFloat(e.target.value) || 0 }))}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            step="0.1"
          />
        </div>

        <div>
          <label>Option Type:</label>
          <select
            value={filters.optionType}
            onChange={(e) => setFilters(prev => ({ ...prev, optionType: e.target.value as 'calls' | 'puts' | 'both' }))}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="both">Both</option>
            <option value="calls">Calls Only</option>
            <option value="puts">Puts Only</option>
          </select>
        </div>
      </div>

      <button 
        onClick={handleScreenerSearch} 
        disabled={loading || filters.tickers.length === 0}
        style={{
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          fontSize: '16px'
        }}
      >
        {loading ? 'Screening...' : `Screen ${filters.tickers.length} Ticker${filters.tickers.length !== 1 ? 's' : ''}`}
      </button>
    </div>
  );
} 