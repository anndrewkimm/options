import React, { useState } from "react";
import { fetchOptionsData } from "./api";
import OptionsTable from "./components/OptionsTable";

export default function App() {
  const [ticker, setTicker] = useState("");
  const [calls, setCalls] = useState<any[]>([]);
  const [puts, setPuts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    if (!ticker.trim()) {
      setError("Please enter a ticker symbol.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchOptionsData({
        ticker: ticker.trim().toUpperCase(),
      });
      setCalls(data.calls || []);
      setPuts(data.puts || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch options data");
      setCalls([]);
      setPuts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Options Screener</h1>
      <input
        type="text"
        placeholder="Enter ticker (e.g. AAPL)"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Loading..." : "Search"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!error && !loading && (
        <>
          <OptionsTable title="Calls" options={calls} />
          <OptionsTable title="Puts" options={puts} />
        </>
      )}
    </div>
  );
}
