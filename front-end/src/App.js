import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { UserProvider } from './context/UserContext';


function App() {

    return (
        <UserProvider>
            <Router>
                < Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                </ Routes>
            </Router>
        </UserProvider>


    );
}

export default App;
