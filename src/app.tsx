import { Outlet } from "react-router-dom";
import { Header } from "./components/header";
import Timer from "./components/timer";
import Tabs from "./components/tabs";

function App() {
  return (
    <>
      <Header />
      <Timer />
      <Tabs />
      <Outlet />
    </>
  );
}

export default App;
