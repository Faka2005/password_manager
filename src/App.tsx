import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import MyNavbar from "./screens/Navbar";
import LoginForm from "./screens/LoginScreens";
// import ProfilePage from "./screens/ProfilScreens";
import RegisterForm from "./screens/RegisterScreens"
import Dashboard from "./screens/Dashboard";
function App() {
  return (
    <Router>
      {/* <MyNavbar />  */}
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />


      </Routes>
    </Router>
  );
}

export default App;
