from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)  # Allow frontend requests

@app.route("/api/options", methods=["POST"])
def get_options():
    data = request.get_json()
    ticker_symbol = data.get("ticker", "AAPL")  # Default to AAPL if none provided

    try:
        ticker = yf.Ticker(ticker_symbol)
        expirations = ticker.options
        if not expirations:
            return jsonify({"error": "No expirations found"}), 404

        chosen_date = expirations[0]  # Nearest expiration
        options_chain = ticker.option_chain(chosen_date)

        calls = options_chain.calls.head(10).to_dict(orient="records")
        puts = options_chain.puts.head(10).to_dict(orient="records")

        return jsonify({
            "ticker": ticker_symbol,
            "expiration": chosen_date,
            "calls": calls,
            "puts": puts
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
