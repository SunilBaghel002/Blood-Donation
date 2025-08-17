import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BloodChainLanding from './pages/landing';
import BloodManagementSystem from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BloodChainLanding />} />
        <Route path="/dashboard" element={<BloodManagementSystem />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;