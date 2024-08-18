import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NewPost from './pages/CreatePost';
import NewThread from './pages/CreateThread';
import UpdateThread from './pages/EditThread';
import UpdatePost from './pages/EditPost';
import ExploreComp from './pages/Explore';
import Posts from './pages/Posts';
import Post from './pages/Post';
import ProfileUser from './pages/UserProfile';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/posts/:idthread/:title" element={<Posts />} />
                    <Route path="/explore" element={<ExploreComp />} />
                    <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                    <Route path="/profile/:username" element={<ProtectedRoute element={<ProfileUser />} />} />
                    <Route path="/post/:idpost/:title" element={<ProtectedRoute element={<Post />} />} />
                    <Route path="/create/post" element={<ProtectedRoute element={< NewPost />} />} />
                    <Route path="/create/thread" element={<ProtectedRoute element={<NewThread />} />} />
                    <Route path="/edit-thread/:idthread/:title" element={<ProtectedRoute element={<UpdateThread />} />} />
                    <Route path="/edit-post/:idpost/:title/:content" element={<ProtectedRoute element={<UpdatePost />} />} />

                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
