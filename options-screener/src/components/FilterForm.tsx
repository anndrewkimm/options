import React, { useState, useEffect } from 'react';
import { fetchExpirations } from '../api';

type FilterFormProps = {
  ticker: string;
  onFiltersChange: (filters: any) => void;
  onSearch: () => void;
  loading: boolean;
};

export default function FilterForm({ ticker, onFiltersChange, onSearch, loading }: FilterFormProps) {
  const [expirations, setExpirations] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    expiration: '',
    minVolume: 0,
    minOpenInterest: 0,
    maxBidAskSpread: 10,
    includeGreeks: true
  });

  useEffect(() => {
    if (ticker) {
      fetchExpirations(ticker)
        .then(setExpirations)
        .catch(console.error);
    }
  }, [ticker]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: '20px', 
      borderRadius: '8px', 
      marginBottom: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>Filters</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <div>
          <label>Expiration Date:</label>
          <select 
            value={filters.expiration} 
            onChange={(e) => handleFilterChange('expiration', e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Auto-select nearest</option>
            {expirations.map((exp) => (
              <option key={exp} value={exp}>
                {new Date(exp).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Min Volume:</label>
          <input
            type="number"
            value={filters.minVolume}
            onChange={(e) => handleFilterChange('minVolume', parseInt(e.target.value) || 0)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="0"
          />
        </div>

        <div>
          <label>Min Open Interest:</label>
          <input
            type="number"
            value={filters.minOpenInterest}
            onChange={(e) => handleFilterChange('minOpenInterest', parseInt(e.target.value) || 0)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="0"
          />
        </div>

        <div>
          <label>Max Bid-Ask Spread (%):</label>
          <input
            type="number"
            value={filters.maxBidAskSpread}
            onChange={(e) => handleFilterChange('maxBidAskSpread', parseFloat(e.target.value) || 0)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="10"
            step="0.1"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
          <input
            type="checkbox"
            id="includeGreeks"
            checked={filters.includeGreeks}
            onChange={(e) => handleFilterChange('includeGreeks', e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          <label htmlFor="includeGreeks">Include Greeks</label>
        </div>
      </div>

      <button 
        onClick={onSearch} 
        disabled={loading}
        style={{
          marginTop: '15px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? 'Loading...' : 'Apply Filters'}
      </button>
    </div>
  );
}
