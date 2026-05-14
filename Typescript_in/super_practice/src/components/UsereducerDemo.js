import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useReducer } from "react";
const initialState = { count: 0 };
function reducer(state, action) {
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
    return (_jsxs("div", { children: [_jsxs("p", { children: ["Count: ", state.count] }), _jsx("button", { onClick: () => dispatch({ type: "increment" }), children: "+1" }), _jsx("button", { onClick: () => dispatch({ type: "decrement" }), children: "-1" }), _jsx("button", { onClick: () => dispatch({ type: "increment", step: 5 }), children: "+5" }), _jsx("button", { onClick: () => dispatch({ type: "reset" }), children: "Reset" })] }));
};
export default UsereducerDemo;
//# sourceMappingURL=UsereducerDemo.js.map