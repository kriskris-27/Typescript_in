import { useReducer } from "react";

type State = { count: number };
type Action =
  | { type: "increment"; step?: number }
  | { type: "decrement"; step?: number }
  | { type: "reset" };

const initialState: State = { count: 0 };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { count: state.count + (action.step ?? 1) };
    case "decrement":
      return { count: state.count - (action.step ?? 1) };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

const UsereducerDemo = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+1</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-1</button>
      <button onClick={() => dispatch({ type: "increment", step: 5 })}>+5</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
};

export default UsereducerDemo;
