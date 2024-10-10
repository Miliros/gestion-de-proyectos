import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Home";
import CreateProject from "./components/Projects";
import Home from "./components/Home";
import Projects from "./components/Projects";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </Router>
  );
}

export default App;
