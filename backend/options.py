from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow frontend requests

@app.route("/api/options", methods=["POST"])
def get_options():
    data = request.get_json()
    ticker_symbol = data.get("ticker", "AAPL").upper()
    expiration_date = data.get("expiration")  # Optional specific date
    min_volume = data.get("minVolume", 0)
    min_open_interest = data.get("minOpenInterest", 0)
    max_bid_ask_spread = data.get("maxBidAskSpread")  # Optional max spread percentage
    include_greeks = data.get("includeGreeks", True)

    try:
        ticker = yf.Ticker(ticker_symbol)
        
        # Get current stock price
        current_price = ticker.info.get('regularMarketPrice', 0)
        
        # Get available expiration dates
        expirations = ticker.options
        if not expirations:
            return jsonify({"error": "No expirations found"}), 404

        # Use specified expiration or default to nearest
        chosen_date = expiration_date if expiration_date in expirations else expirations[0]
        
        # Get options chain
        options_chain = ticker.option_chain(chosen_date)
        
        # Process calls
        calls_df = options_chain.calls.copy()
        calls_df = filter_options(calls_df, min_volume, min_open_interest, max_bid_ask_spread, current_price)
        
        # Process puts
        puts_df = options_chain.puts.copy()
        puts_df = filter_options(puts_df, min_volume, min_open_interest, max_bid_ask_spread, current_price)
        
        # Convert to records
        calls = calls_df.to_dict(orient="records")
        puts = puts_df.to_dict(orient="records")
        
        # Add calculated fields
        for option_list in [calls, puts]:
            for option in option_list:
                option['bidAskSpread'] = round(option['ask'] - option['bid'], 2)
                option['bidAskSpreadPercent'] = round(((option['ask'] - option['bid']) / option['ask']) * 100, 2) if option['ask'] > 0 else 0
                option['moneyness'] = 'ITM' if (option.get('inTheMoney', False)) else 'OTM' if option.get('outOfTheMoney', False) else 'ATM'
                
                # Format numbers for display
                option['strike'] = round(option['strike'], 2)
                option['lastPrice'] = round(option['lastPrice'], 2)
                option['bid'] = round(option['bid'], 2)
                option['ask'] = round(option['ask'], 2)
                if 'impliedVolatility' in option and option['impliedVolatility'] is not None:
                    option['impliedVolatility'] = round(option['impliedVolatility'] * 100, 2)
                if 'delta' in option and option['delta'] is not None:
                    option['delta'] = round(option['delta'], 3)

        return jsonify({
            "ticker": ticker_symbol,
            "currentPrice": current_price,
            "expiration": chosen_date,
            "availableExpirations": expirations,
            "calls": calls,
            "puts": puts,
            "filters": {
                "minVolume": min_volume,
                "minOpenInterest": min_open_interest,
                "maxBidAskSpread": max_bid_ask_spread
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/expirations/<ticker>", methods=["GET"])
def get_expirations(ticker):
    try:
        ticker_obj = yf.Ticker(ticker.upper())
        expirations = ticker_obj.options
        return jsonify({"expirations": expirations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/historical-data/<ticker>", methods=["GET"])
def get_historical_data(ticker):
    try:
        ticker_obj = yf.Ticker(ticker.upper())
        
        # Get historical data for the last 30 days
        hist_data = ticker_obj.history(period="30d", interval="1d")
        
        # Convert to candlestick format
        candlestick_data = []
        for index, row in hist_data.iterrows():
            candlestick_data.append({
                "time": index.strftime('%Y-%m-%d'),
                "open": float(row['Open']),
                "high": float(row['High']),
                "low": float(row['Low']),
                "close": float(row['Close'])
            })
        
        return jsonify({"data": candlestick_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/screener", methods=["POST"])
def screen_options():
    data = request.get_json()
    tickers = data.get("tickers", [])
    min_volume = data.get("minVolume", 100)
    min_open_interest = data.get("minOpenInterest", 50)
    max_bid_ask_spread = data.get("maxBidAskSpread", 10)  # percentage
    option_type = data.get("optionType", "both")  # "calls", "puts", or "both"
    
    results = []
    
    for ticker in tickers[:10]:  # Limit to 10 tickers for performance
        try:
            ticker_obj = yf.Ticker(ticker.upper())
            current_price = ticker_obj.info.get('regularMarketPrice', 0)
            
            if not ticker_obj.options:
                continue
                
            # Get nearest expiration
            expiration = ticker_obj.options[0]
            options_chain = ticker_obj.option_chain(expiration)
            
            # Process based on option type
            if option_type in ["calls", "both"]:
                calls_df = filter_options(options_chain.calls, min_volume, min_open_interest, max_bid_ask_spread, current_price)
                for _, call in calls_df.iterrows():
                    results.append({
                        "ticker": ticker.upper(),
                        "type": "Call",
                        "expiration": expiration,
                        "strike": call['strike'],
                        "lastPrice": call['lastPrice'],
                        "bid": call['bid'],
                        "ask": call['ask'],
                        "volume": call['volume'],
                        "openInterest": call['openInterest'],
                        "impliedVolatility": call.get('impliedVolatility', 0) * 100 if call.get('impliedVolatility') else 0,
                        "currentPrice": current_price
                    })
            
            if option_type in ["puts", "both"]:
                puts_df = filter_options(options_chain.puts, min_volume, min_open_interest, max_bid_ask_spread, current_price)
                for _, put in puts_df.iterrows():
                    results.append({
                        "ticker": ticker.upper(),
                        "type": "Put",
                        "expiration": expiration,
                        "strike": put['strike'],
                        "lastPrice": put['lastPrice'],
                        "bid": put['bid'],
                        "ask": put['ask'],
                        "volume": put['volume'],
                        "openInterest": put['openInterest'],
                        "impliedVolatility": put.get('impliedVolatility', 0) * 100 if put.get('impliedVolatility') else 0,
                        "currentPrice": current_price
                    })
                    
        except Exception as e:
            print(f"Error processing {ticker}: {e}")
            continue
    
    return jsonify({"results": results})

def filter_options(df, min_volume, min_open_interest, max_bid_ask_spread, current_price):
    """Filter options based on criteria"""
    if df.empty:
        return df
    
    # Apply volume filter
    if min_volume > 0:
        df = df[df['volume'] >= min_volume]
    
    # Apply open interest filter
    if min_open_interest > 0:
        df = df[df['openInterest'] >= min_open_interest]
    
    # Apply bid-ask spread filter
    if max_bid_ask_spread:
        df['bid_ask_spread_pct'] = ((df['ask'] - df['bid']) / df['ask']) * 100
        df = df[df['bid_ask_spread_pct'] <= max_bid_ask_spread]
    
    # Sort by volume descending
    df = df.sort_values('volume', ascending=False)
    
    return df.head(20)  # Return top 20 by volume

if __name__ == "__main__":
    app.run(debug=True)
