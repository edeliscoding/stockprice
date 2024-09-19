import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import StockSearch from "./components/StockSearch";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="grid h-screen place-content-center">
      <StockSearch />
    </div>
  );
}

export default App;
