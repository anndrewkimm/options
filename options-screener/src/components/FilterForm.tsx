import React, { useState } from "react";

type Props = {
  onSearch: (filters: {
    ticker: string;
    minPremium: number;
    ivRank: number;
    deltaRange: [number, number];
  }) => void;
};

const FilterForm: React.FC<Props> = ({ onSearch }) => {
  const [ticker, setTicker] = useState("");
  const [minPremium, setMinPremium] = useState(0);
  const [ivRank, setIvRank] = useState(50);
  const [deltaMin, setDeltaMin] = useState(-0.5);
  const [deltaMax, setDeltaMax] = useState(0.5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      ticker,
      minPremium,
      ivRank,
      deltaRange: [deltaMin, deltaMax],
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ticker (e.g., AAPL)"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
      />
      <input
        type="number"
        placeholder="Min Premium"
        value={minPremium}
        onChange={(e) => setMinPremium(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="IV Rank"
        value={ivRank}
        onChange={(e) => setIvRank(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Delta Min"
        value={deltaMin}
        onChange={(e) => setDeltaMin(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Delta Max"
        value={deltaMax}
        onChange={(e) => setDeltaMax(Number(e.target.value))}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default FilterForm;
