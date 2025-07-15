import type { OptionContract } from '../api';

type Props = {
  title: string;
  options: OptionContract[];
  currentPrice?: number;
};

export default function OptionsTable({ title, options, currentPrice }: Props) {
  if (!options || options.length === 0) {
    return <p>No {title.toLowerCase()} data available.</p>;
  }

  const getMoneynessColor = (moneyness?: string) => {
    switch (moneyness) {
      case 'ITM': return '#28a745';
      case 'ATM': return '#ffc107';
      case 'OTM': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3>{title}</h3>
      {currentPrice && (
        <p style={{ color: '#666', marginBottom: '10px' }}>
          Current Price: <strong>${currentPrice.toFixed(2)}</strong>
        </p>
      )}
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
              <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Symbol</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Strike</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Last</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Bid</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Ask</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Spread</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Vol</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>OI</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>IV</th>
              <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Delta</th>
              <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Moneyness</th>
            </tr>
          </thead>
          <tbody>
            {options.map((opt) => (
              <tr key={opt.contractSymbol} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '10px 8px', fontFamily: 'monospace', fontSize: '12px' }}>
                  {opt.contractSymbol}
                </td>
                <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                  ${opt.strike}
                </td>
                <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                  ${opt.lastPrice}
                </td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: '#28a745' }}>
                  ${opt.bid}
                </td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: '#dc3545' }}>
                  ${opt.ask}
                </td>
                <td style={{ padding: '10px 8px', textAlign: 'right', fontSize: '12px' }}>
                  ${opt.bidAskSpread} ({opt.bidAskSpreadPercent}%)
                </td>
                <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                  {opt.volume.toLocaleString()}
                </td>
                <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                  {opt.openInterest.toLocaleString()}
                </td>
                <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                  {typeof opt.impliedVolatility === "number"
                    ? opt.impliedVolatility.toFixed(1) + "%"
                    : "N/A"}
                </td>
                <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                  {typeof opt.delta === "number" ? opt.delta.toFixed(3) : "N/A"}
                </td>
                <td style={{ 
                  padding: '10px 8px', 
                  textAlign: 'center',
                  color: getMoneynessColor(opt.moneyness),
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}>
                  {opt.moneyness || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
