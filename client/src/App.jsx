import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BloodChainLanding from './pages/landing';
import BloodManagementSystem from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FutureScopes from './pages/FutureScopes'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BloodChainLanding />} />
        <Route path="/dashboard" element={<BloodManagementSystem />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/future-scopes" element={<FutureScopes />} />
      </Routes>
    </Router>
  );
}

export default App;