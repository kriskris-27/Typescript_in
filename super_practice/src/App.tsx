
import "./App.css";
import Counter from "./components/Counter";
import DebouncedSearch from "./components/DebouncedSearch";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import UserList from "./components/Usememo";

const Profile = () => {
  const { user, login, logout } = useAuth();

  return (
    <div>
      <p>User: {user?.name ?? "Guest"}</p>
      <button onClick={() => login("Ada")}>Log in as Ada</button>
      <button onClick={logout}>Log out</button>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <Profile />
        <Counter />
        <DebouncedSearch />
        <UserList/>
      </div>
    </AuthProvider>
  );
}

export default App;
