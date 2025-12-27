import { useEffect, useState } from "react";

const Counter = () => {
  const [num, setNum] = useState(0);

  useEffect(() => {
    document.title = `Count: ${num}`;
    console.log("Counter updated", num);
  }, [num]);

  return (
    <div>
      <p>{num}</p>
      <button onClick={() => setNum((num) => num + 1)}>Increment</button>
      <button onClick={() => setNum((num) => num - 1)}>Decrement</button>
    </div>
  );
};

export default Counter;
