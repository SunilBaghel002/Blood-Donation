import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BloodChainLanding from "./pages/landing";
import BloodManagementSystem from "./pages/start";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BloodChainLanding />} />
        <Route path="/dashboard" element={<BloodManagementSystem />} />
      </Routes>
    </Router>
  );
}

export default App;
