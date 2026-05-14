import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
const mockSearch = async (term) => {
    if (!term)
        return [];
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return [`Result for "${term}"`, `Another hit for "${term}"`];
};
const DebouncedSearch = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [status, setStatus] = useState("idle");
    const debounceRef = useRef(null);
    const handleChange = (event) => {
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
    return (_jsxs("section", { children: [_jsx("h2", { children: "Debounced Search" }), _jsx("input", { value: query, onChange: handleChange, placeholder: "Type to search", className: "search-input" }), status === "loading" && _jsx("p", { children: "Searching..." }), _jsx("ul", { children: results.map((item) => (_jsx("li", { children: item }, item))) })] }));
};
export default DebouncedSearch;
//# sourceMappingURL=DebouncedSearch.js.map