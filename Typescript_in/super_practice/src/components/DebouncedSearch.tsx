import { useRef, useState, type ChangeEvent } from "react";

const mockSearch = async (term: string): Promise<string[]> => {
  if (!term) return [];
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return [`Result for "${term}"`, `Another hit for "${term}"`];
};

const DebouncedSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const debounceRef = useRef<number | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(async () => {
      setStatus("loading");
      const data = await mockSearch(value.trim());
      setResults(data);
      setStatus("idle");
    }, 2000);
  };

  return (
    <section>
      <h2>Debounced Search</h2>
      <input
        value={query}
        onChange={handleChange}
        placeholder="Type to search"
        className="search-input"
      />
      {status === "loading" && <p>Searching...</p>}
      <ul>
        {results.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

export default DebouncedSearch;