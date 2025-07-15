import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import type { CandlestickData } from '../api';

interface PriceChartProps {
  ticker: string;
  data: CandlestickData[];
  currentPrice: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ ticker, data, currentPrice }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('PriceChart useEffect - data length:', data.length);
    if (!chartContainerRef.current || !data.length) return;

    try {
      // Create chart
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        crosshair: {
          mode: 1,
        },
        rightPriceScale: {
          borderColor: '#ddd',
        },
        timeScale: {
          borderColor: '#ddd',
          timeVisible: true,
          secondsVisible: false,
        },
      });

      // Convert candlestick data to line data (close prices)
      const lineData = data.map(item => {
        const [year, month, day] = item.time.split('-').map(Number);
        return {
          time: { year, month, day },
          value: item.close
        };
      });
      console.log('Chart lineData:', lineData);
      console.log('First lineData point:', lineData[0]);
      

      // Create area series using v5 API
      const areaSeries = (chart as any).addSeries(
        'Area',
        {
          topColor: 'rgba(0, 123, 255, 0.3)',
          bottomColor: 'rgba(0, 123, 255, 0.0)',
          lineColor: '#007bff',
          lineWidth: 2
        }
      );

      // Set data
      areaSeries.setData(lineData);

      // Markers are not supported on area series in v5
      // If you want a marker, use a line series instead

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }, [data, currentPrice]);

  if (!data.length) {
    return (
      <div style={{ 
        height: 400, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px'
      }}>
        <p style={{ color: '#6c757d', margin: 0 }}>No chart data available</p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>
        {ticker} Price Chart (30 Days)
      </h3>
      <div 
        ref={chartContainerRef} 
        style={{ 
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      />
    </div>
  );
};

export default PriceChart; 