import { Outlet } from "react-router-dom";
import { Header } from "./components/header";
import Timer from "./components/timer";
import Tabs from "./components/tabs";

function App() {
  return (
    <div>
      <Header />
      <Timer />
      <Tabs />
      <Outlet />
    </div>
  );
}

export default App;
