import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, } from "react";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const login = (name) => setUser({ name });
    const logout = () => setUser(null);
    return (_jsx(AuthContext.Provider, { value: { user, login, logout }, children: children }));
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside <AuthProvider>");
    }
    return ctx;
};
//# sourceMappingURL=AuthContext.js.map