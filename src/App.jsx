import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

const Home = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Admin Portal</h1>
      <Link to="/admin">
        <button style={{ padding: "10px 20px", fontSize: "16px" }}>
          Go to Admin Panel
        </button>
      </Link>
    </div>
  );
};

export default App;
