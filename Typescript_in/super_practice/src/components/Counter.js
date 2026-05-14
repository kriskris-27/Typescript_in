import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
const Counter = () => {
    const [num, setNum] = useState(0);
    useEffect(() => {
        document.title = `Count: ${num}`;
        console.log("Counter updated", num);
    }, [num]);
    return (_jsxs("div", { children: [_jsx("p", { children: num }), _jsx("button", { onClick: () => setNum((num) => num + 1), children: "Increment" }), _jsx("button", { onClick: () => setNum((num) => num - 1), children: "Decrement" })] }));
};
export default Counter;
//# sourceMappingURL=Counter.js.map