import { useState, useContext, useEffect, useCallback, useMemo } from "react";
import Badge from 'react-bootstrap/Badge';
import PostCard from './PostCard';
import Def_profile from '../img/default_ProfileImage.png';
import axios from 'axios';
import { UserContext } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:8000',
    validateStatus: (status) => status >= 200 && status < 500,
});

const UserProfile = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [username, setUsername] = useState({ modif: false, value: '' });
    const [password, setPassword] = useState({ modif: false, value: '****************' });
    const [textuser, setTextUser] = useState({ modif: false, value: '' });
    const [email, setEmail] = useState({ modif: false, value: '' });
    const [profileImage, setProfileImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(`/users/${user}`);
                if (response.status === 200) {
                    setUserData(response.data.user);
                } else {
                    navigate('/', { state: { showToast: true, message: 'An error occurred, try again later.', toastType: 'error' } });
                }
            } catch (error) {
                navigate('/', { state: { showToast: true, message: 'An error occurred, try again later.', toastType: 'error' } });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [user, navigate]);

    useEffect(() => {
        if (userData) {
            setUsername({ modif: false, value: userData.username });
            setTextUser({ modif: false, value: userData.textuser || '' });
            setEmail({ modif: false, value: userData.email });
        }
    }, [userData]);

    const handleInputChange = (setter, key) => (event) => {
        setter({ modif: true, value: event.target.value });
        setErrors((prevErrors) => ({ ...prevErrors, [key]: '' }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setErrors((prevErrors) => ({ ...prevErrors, image: '' }));
            setProfileImage(file);
        }
    };

    const handleSaveChanges = useCallback(async () => {
        const apiCalls = [];
        if (username.modif) {
            apiCalls.push(axiosInstance.put('/users/username', { username: username.value }));
        }
        if (password.modif) {
            apiCalls.push(axiosInstance.put('/users/password', { password: password.value }));
        }
        if (textuser.modif) {
            apiCalls.push(axiosInstance.put('/users/textuser', { textuser: textuser.value }));
        }
        if (profileImage) {
            const formData = new FormData();
            formData.append('image', profileImage);
            apiCalls.push(axiosInstance.put('/users/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }));
        }

        try {
            const results = await Promise.all(apiCalls);
            const errorObj = {};
            const successObj = {};

            results.forEach((response) => {
                if (response.status === 400) {
                    response.data.errors.forEach(error => {
                        errorObj[error.path] = error.msg;
                    });
                    setErrors(errorObj);
                } else if (response.status === 500) {
                    console.error('There was an error while making changes');
                } else {
                    if (response.data.message === 'Username updated successfully') successObj['username'] = response.data.message;
                    if (response.data.message === 'Password updated successfully') successObj['password'] = response.data.message;
                    if (response.data.message === 'Text user updated successfully') successObj['textuser'] = response.data.message;
                    if (response.data.message === 'Profile image updated successfully') successObj['image'] = response.data.message;
                    setSuccess(successObj);
                }
            });

            setUsername((prev) => ({ ...prev, modif: false }));
            setPassword((prev) => ({ ...prev, modif: false }));
            setTextUser((prev) => ({ ...prev, modif: false }));

        } catch (error) {
            toast.error('Error while saving changes', { hideProgressBar: true, autoClose: 2000 });
        }
    }, [username, password, textuser, profileImage]);

    if (isLoading) {
        return (
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="main-body">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-column align-items-center text-center">
                                    <img
                                        src={profileImage ? URL.createObjectURL(profileImage) : Def_profile}
                                        alt="Admin"
                                        className="rounded-circle p-1 bg-primary"
                                        width="110"
                                    />
                                    <div className="mt-3">
                                        <h4>{username.value}</h4>
                                        <p className="text-secondary mb-1">{email.value}</p>
                                        <p className="text-secondary mb-1">{textuser.value}</p>
                                    </div>
                                </div>
                                <hr className="my-4" />
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                        <h6 className="mb-0">
                                            Followers
                                            <Badge className="badge-spacing" bg="secondary">150</Badge>
                                        </h6>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                        <h6 className="mb-0">
                                            Followings
                                            <Badge className="badge-spacing" bg="secondary">150</Badge>
                                        </h6>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                        <h5 className="mb-0">Your threads</h5>
                                        <ul>
                                            <li>
                                                <a href="#" style={{ textDecoration: 'none' }}>thread title 1</a>
                                            </li>
                                        </ul>
                                        <ul>
                                            <li>
                                                <a href="#" style={{ textDecoration: 'none' }}>thread title 2</a>
                                            </li>
                                        </ul>
                                        <ul>
                                            <li>
                                                <a href="#" style={{ textDecoration: 'none' }}>thread title 3</a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Username</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input
                                            type="text"
                                            className={`form-control ${errors.username ? 'is-invalid' : 'is-valid'}`}
                                            value={username.value}
                                            onChange={handleInputChange(setUsername, 'username')}
                                        />
                                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                        {success.username && <div className="valid-feedback">{success.username}</div>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Password</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input
                                            type="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : 'is-valid'}`}
                                            value={password.value}
                                            onChange={handleInputChange(setPassword, 'password')}
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                        {success.password && <div className="valid-feedback">{success.password}</div>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">User Description</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <textarea
                                            className={`form-control ${errors.textuser ? 'is-invalid' : 'is-valid'}`}
                                            rows="4"
                                            value={textuser.value}
                                            onChange={handleInputChange(setTextUser, 'textuser')}
                                        />
                                        {errors.textuser && <div className="invalid-feedback">{errors.textuser}</div>}
                                        {success.textuser && <div className="valid-feedback">{success.textuser}</div>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Profile image</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <input
                                            className={`form-control ${errors.image ? 'is-invalid' : 'is-valid'}`}
                                            type="file" id="formFile"
                                            onChange={handleFileChange}
                                        />
                                        {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                                        {success.image && <div className="valid-feedback">{success.image}</div>}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-3"></div>
                                    <div className="col-sm-9 text-secondary">
                                        <input
                                            type="button"
                                            className="btn btn-primary px-4"
                                            value="Save Changes"
                                            onClick={handleSaveChanges}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="d-flex align-items-center mb-3">Your posts</h5>
                                        <PostCard />
                                        <PostCard />
                                        <PostCard />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
