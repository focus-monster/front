import { Outlet } from "react-router-dom";
import { Header } from "./components/header";
import Timer from "./components/timer";
import Tabs from "./components/tabs";

function App() {
  return (
    <div className="min-h-svh w-svw max-w-6xl">
      <Header />
      <Timer />
      <Tabs />
      <Outlet />
    </div>
  );
}

export default App;
