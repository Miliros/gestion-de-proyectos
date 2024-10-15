import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Login/LoginForm";
import Home from "./components/Home/Home";
import Projects from "./components/Projects/Projects";
import Task from "./components/Task/Task";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/NavBar/NavBar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />

        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Home />} />}
        />
        <Route
          path="/projects"
          element={<PrivateRoute element={<Projects />} />}
        />
        <Route path="/tasks" element={<PrivateRoute element={<Task />} />} />
      </Routes>
    </Router>
  );
}

export default App;
