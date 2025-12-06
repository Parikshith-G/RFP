import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import RfpDashboard from "./components/RfpDashboard";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      app ready
      <RfpDashboard />
    </>
  );
}

export default App;
