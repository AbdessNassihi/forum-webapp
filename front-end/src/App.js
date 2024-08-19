import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./pages/Home";
import Register from "./pages/authentication/RegisterPage";
import Login from "./pages/authentication/LoginPage";
import Profile from "./pages/profile/ProfilePage";
import NewPost from './pages/posts/PostCreationPage';
import NewThread from './pages/threads/ThreadCreationPage';
import UpdateThread from './pages/threads/ThreadUpdatingPage';
import UpdatePost from './pages/posts/PostUpdating';
import ExploreComponent from './pages/threads/ThreadsExploringPage';
import ThreadPosts from './pages/posts/PostsOfThreadPage';
import Post from './pages/posts/PostPage';
import ProfileMember from './pages/profile/ProfileMemberPage';
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
                    <Route path="/posts/:idthread/:title" element={<ProtectedRoute element={<ThreadPosts />} />} />
                    <Route path="/explore" element={<ProtectedRoute element={<ExploreComponent />} />} />
                    <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                    <Route path="/profile/:username" element={<ProtectedRoute element={<ProfileMember />} />} />
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
