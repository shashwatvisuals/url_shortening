import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
