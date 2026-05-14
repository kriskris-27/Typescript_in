import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import "./App.css";
import Counter from "./components/Counter";
import DebouncedSearch from "./components/DebouncedSearch";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import UserList from "./components/Usememo";
import UsereducerDemo from "./components/UsereducerDemo";
const Profile = () => {
    const { user, login, logout } = useAuth();
    return (_jsxs("div", { children: [_jsxs("p", { children: ["User: ", user?.name ?? "Guest"] }), _jsx("button", { onClick: () => login("Ada"), children: "Log in as Ada" }), _jsx("button", { onClick: logout, children: "Log out" })] }));
};
function App() {
    return (_jsx(AuthProvider, { children: _jsxs("div", { className: "app", children: [_jsx("h1", { className: "text-3xl font-bold underline", children: "Hello world!" }), _jsx(Profile, {}), _jsx(Counter, {}), _jsx(DebouncedSearch, {}), _jsx(UserList, {}), _jsx(UsereducerDemo, {})] }) }));
}
export default App;
//# sourceMappingURL=App.js.map