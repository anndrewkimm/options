type OptionContract = {
  contractSymbol: string;
  strike: number;
  lastPrice: number;
  bid: number;
  ask: number;
  volume: number;
  openInterest: number;
  impliedVolatility?: number; // make optional to reflect possible missing
  delta?: number; // same here
};

type Props = {
  title: string;
  options: OptionContract[];
};

export default function OptionsTable({ title, options }: Props) {
  if (!options || options.length === 0) {
    return <p>No {title.toLowerCase()} data available.</p>;
  }

  return (
    <div>
      <h3>{title}</h3>
      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Strike</th>
            <th>Last Price</th>
            <th>Bid</th>
            <th>Ask</th>
            <th>Volume</th>
            <th>Open Interest</th>
            <th>IV</th>
            <th>Delta</th>
          </tr>
        </thead>
        <tbody>
          {options.map((opt) => (
            <tr key={opt.contractSymbol}>
              <td>{opt.contractSymbol}</td>
              <td>{opt.strike}</td>
              <td>{opt.lastPrice}</td>
              <td>{opt.bid}</td>
              <td>{opt.ask}</td>
              <td>{opt.volume}</td>
              <td>{opt.openInterest}</td>
              <td>
                {typeof opt.impliedVolatility === "number"
                  ? (opt.impliedVolatility * 100).toFixed(2) + "%"
                  : "N/A"}
              </td>
              <td>
                {typeof opt.delta === "number" ? opt.delta.toFixed(2) : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
