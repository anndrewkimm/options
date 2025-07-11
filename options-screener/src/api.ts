export type OptionsFilters = {
  ticker: string;
};

export async function fetchOptionsData(filters: OptionsFilters) {
  const response = await fetch("http://127.0.0.1:5000/api/options", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filters),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || "Failed to fetch options data";
    throw new Error(message);
  }

  return response.json();
}
