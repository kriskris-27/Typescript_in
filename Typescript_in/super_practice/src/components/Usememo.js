import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useMemo, useState } from "react";
const USERS = [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Charlie Brown" },
    // imagine thousands more...
];
export default function UserList() {
    const [search, setSearch] = useState("");
    const [refreshCount, setRefreshCount] = useState(0);
    // Derived value: filtered users
    const filteredUsers = USERS.filter((user) => {
        console.log("Filtering..."); // 👈 You’ll see this a LOT
        return user.name.toLowerCase().includes(search.toLowerCase());
    });
    console.log("outer");
    // const filteredUsers = useMemo(() => {
    //     console.log("run");
    //     console.log("Filtering...");
    //     const query = search.toLowerCase();
    //     return USERS.filter((user) =>
    //       user.name.toLowerCase().includes(query)
    //     );
    //   }, [search]);
    return (_jsxs("div", { children: [_jsxs("button", { onClick: () => setRefreshCount((c) => c + 1), children: ["Force re-render: ", refreshCount] }), _jsx("br", {}), _jsx("input", { placeholder: "Search users...", value: search, onChange: (e) => setSearch(e.target.value) }), _jsx("ul", { children: filteredUsers.map((user) => (_jsx("li", { children: user.name }, user.id))) })] }));
}
//# sourceMappingURL=Usememo.js.map