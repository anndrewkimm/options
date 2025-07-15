# Options Screener

A powerful options screening and analysis tool built with React (frontend) and Flask (backend) that helps you find and analyze options contracts based on various criteria.

## Features

### Single Ticker Analysis

- **Real-time Options Data**: Get live options data for any stock ticker
- **Multiple Expiration Dates**: Choose from available expiration dates or auto-select the nearest
- **Advanced Filtering**: Filter by volume, open interest, bid-ask spread, and more
- **Greeks Analysis**: View implied volatility, delta, and other Greeks
- **Moneyness Indicators**: See which options are ITM, ATM, or OTM
- **Bid-Ask Spread Analysis**: Monitor liquidity with spread calculations

### Multi-Ticker Screener

- **Batch Screening**: Screen multiple tickers simultaneously
- **Customizable Criteria**: Set minimum volume, open interest, and maximum bid-ask spread
- **Option Type Filtering**: Screen for calls only, puts only, or both
- **Results Grouping**: View results organized by ticker for easy comparison

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:

   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Start the Flask server:
   ```bash
   python options.py
   ```

The backend will run on `http://127.0.0.1:5000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd options-screener
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## Usage

### Single Ticker Analysis

1. Enter a ticker symbol (e.g., AAPL, TSLA, SPY)
2. Click "Search" to get options data
3. Use the filters to refine your search:
   - **Expiration Date**: Choose a specific date or let it auto-select
   - **Min Volume**: Filter for options with minimum trading volume
   - **Min Open Interest**: Filter for options with minimum open interest
   - **Max Bid-Ask Spread**: Filter for options with tighter spreads
4. View detailed options tables with key metrics

### Multi-Ticker Screener

1. Add multiple tickers to the screener
2. Set your screening criteria:
   - Minimum volume and open interest
   - Maximum bid-ask spread percentage
   - Option type (calls, puts, or both)
3. Click "Screen" to analyze all tickers
4. Review results grouped by ticker

## Key Metrics Explained

- **Strike**: The price at which the option can be exercised
- **Last Price**: Most recent trade price
- **Bid/Ask**: Current bid and ask prices
- **Spread**: Difference between bid and ask prices
- **Volume**: Number of contracts traded today
- **Open Interest**: Number of outstanding contracts
- **IV (Implied Volatility)**: Market's expectation of future volatility
- **Delta**: Rate of change in option price relative to stock price
- **Moneyness**: ITM (In-the-money), ATM (At-the-money), OTM (Out-of-the-money)

## API Endpoints

- `POST /api/options` - Get options data for a single ticker
- `GET /api/expirations/<ticker>` - Get available expiration dates
- `POST /api/screener` - Screen multiple tickers

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **Backend**: Flask, Python
- **Data Source**: Yahoo Finance (via yfinance)
- **Styling**: Inline CSS with modern design

## Notes

- Data is sourced from Yahoo Finance and may have slight delays
- Some options may not have complete Greeks data available
- The screener is limited to 10 tickers per request for performance
- All prices and calculations are for informational purposes only

## Future Enhancements

- Additional Greeks (Gamma, Theta, Vega)
- Technical indicators and charting
- Option strategy builder
- Historical data analysis
- Export functionality
- Real-time price updates
- Watchlist management
