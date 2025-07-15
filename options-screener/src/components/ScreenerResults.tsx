import React from 'react';
import type { ScreenerResult } from '../api';

type ScreenerResultsProps = {
  results: ScreenerResult[];
};

export default function ScreenerResults({ results }: ScreenerResultsProps) {
  if (!results || results.length === 0) {
    return <p>No results found matching your criteria.</p>;
  }

  // Group results by ticker
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.ticker]) {
      acc[result.ticker] = [];
    }
    acc[result.ticker].push(result);
    return acc;
  }, {} as Record<string, ScreenerResult[]>);

  return (
    <div>
      <h3>Screener Results ({results.length} options found)</h3>
      
      {Object.entries(groupedResults).map(([ticker, tickerResults]) => (
        <div key={ticker} style={{ marginBottom: '30px' }}>
          <h4 style={{ 
            backgroundColor: '#007bff', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            {ticker} - {tickerResults.length} options
          </h4>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              borderCollapse: 'collapse', 
              width: '100%', 
              fontSize: '14px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Type</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Expiration</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Strike</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Last</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Bid</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Ask</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Vol</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>OI</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>IV</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Stock Price</th>
                </tr>
              </thead>
              <tbody>
                {tickerResults.map((result, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ 
                      padding: '10px 8px', 
                      textAlign: 'left',
                      color: result.type === 'Call' ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {result.type}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontSize: '12px' }}>
                      {new Date(result.expiration).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                      ${result.strike}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                      ${result.lastPrice}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: '#28a745' }}>
                      ${result.bid}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: '#dc3545' }}>
                      ${result.ask}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                      {result.volume.toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                      {result.openInterest.toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                      {result.impliedVolatility.toFixed(1)}%
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                      ${result.currentPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
} 