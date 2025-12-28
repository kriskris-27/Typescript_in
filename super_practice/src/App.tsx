
import "./App.css";
import Counter from "./components/Counter";
import DebouncedSearch from "./components/DebouncedSearch";

function App() {
  return (
    <div className="app">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Counter />
      <DebouncedSearch />
    </div>
  );
}

export default App;
