import React, { useState, useContext, useEffect, useCallback } from "react";
import Badge from 'react-bootstrap/Badge';
import PostCard from '../posts/PostCard';
import Def_profile from '../../img/default_ProfileImage.png';
import { UserContext } from "../../context/UserContext";
import { useNavigate } from 'react-router-dom';
import useUserData from '../../hooks/useUserData';
import { toast } from 'react-toastify';
import CardComp from '../Card';
import FormComponent from "../FormComponent";
import { apiCall } from "../../services/api";

const ProfileComponent = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const {
        username,
        email,
        textuser,
        posts,
        createdThreads,
        followedThreads,
        numFollowers,
        numFollowings,
        profileImage,
        isLoading
    } = useUserData(user, navigate);
    const [usernameState, setUsernameState] = useState({ modif: false, value: '' });
    const [postsState, setPostsState] = useState(null);
    const [password, setPassword] = useState({ modif: false, value: '****************' });
    const [textuserState, setTextUserState] = useState({ modif: false, value: '' });
    const [emailState, setEmailState] = useState({ modif: false, value: '' });
    const [profileImageState, setProfileImageState] = useState(null);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({});

    useEffect(() => {
        if (username) {
            setUsernameState({ modif: false, value: username });
            setTextUserState({ modif: false, value: textuser || '' });
            setEmailState({ modif: false, value: email });
            setPostsState(posts);
        }
    }, [username, textuser, email, posts]);

    const handleInputChange = (setter, key) => (event) => {
        setter({ modif: true, value: event.target.value });
        setErrors((prevErrors) => ({ ...prevErrors, [key]: '' }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setErrors((prevErrors) => ({ ...prevErrors, image: '' }));
            setProfileImageState(file);
        }
    };

    const handleDeletePost = (postId) => {
        setPostsState(postsState.filter(post => post.idpost !== postId));
    };

    const handleSaveChanges = useCallback(async () => {
        const apiCalls = [];
        if (usernameState.modif) {
            apiCalls.push(apiCall('put', '/users/username', { username: usernameState.value }));
        }
        if (password.modif) {
            apiCalls.push(apiCall('put', '/users/password', { password: password.value }));
        }
        if (textuserState.modif) {
            apiCalls.push(apiCall('put', '/users/textuser', { textuser: textuserState.value }));
        }
        if (profileImageState instanceof File) {
            const formData = new FormData();
            formData.append('image', profileImageState);
            apiCalls.push(apiCall('put', '/users/image', formData, {
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
                    toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
                } else {
                    if (response.data.message.includes('updated successfully')) {
                        successObj[response.data.field] = response.data.message;
                    }
                    setSuccess(successObj);
                }
            });

            setUsernameState((prev) => ({ ...prev, modif: false }));
            setPassword((prev) => ({ ...prev, modif: false }));
            setTextUserState((prev) => ({ ...prev, modif: false }));

        } catch (error) {
            toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
        }
    }, [usernameState, password, textuserState, profileImageState]);

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

                    <div className="col-12">
                        <CardComp
                            content={
                                <>
                                    <div className="d-flex flex-column align-items-center text-center">
                                        <img
                                            src={profileImageState ? URL.createObjectURL(profileImageState) : (profileImage ? URL.createObjectURL(profileImage) : Def_profile)}
                                            alt="Profile"
                                            className="rounded-circle p-1 bg-primary"
                                            width="110"
                                        />
                                        <div className="mt-3">
                                            <h4>{usernameState.value}</h4>
                                            <p className="text-secondary mb-1">{emailState.value}</p>
                                            <p className="text-secondary mb-1">{textuserState.value}</p>
                                        </div>
                                    </div>
                                    <hr className="my-4" />
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                            <h6 className="mb-0">
                                                Followers
                                                <span style={{ marginLeft: '1.5em' }}>
                                                    <Badge className="badge-spacing" bg="secondary">{numFollowers}</Badge>
                                                </span>
                                            </h6>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                            <h6 className="mb-0">
                                                Followings
                                                <span style={{ marginLeft: '1em' }}>
                                                    <Badge className="badge-spacing" bg="secondary">{numFollowings}</Badge>
                                                </span>
                                            </h6>
                                        </li>
                                    </ul>
                                </>
                            }
                        />
                    </div>

                    <div className="col-12 mt-4">
                        <CardComp
                            title="Your Informations"
                            content={
                                <>
                                    <FormComponent
                                        label="Username"
                                        name="username"
                                        placeholder={usernameState.value}
                                        onChange={handleInputChange(setUsernameState, 'username')}
                                        error={errors.username}
                                        success={success.username}
                                    />
                                    <FormComponent
                                        label="Password"
                                        type="password"
                                        name="password"
                                        placeholder={password.value}
                                        onChange={handleInputChange(setPassword, 'password')}
                                        error={errors.password}
                                        success={success.password}
                                    />
                                    <FormComponent
                                        label="User Description"
                                        name="textuser"
                                        placeholder={textuserState.value}
                                        onChange={handleInputChange(setTextUserState, 'textuser')}
                                        error={errors.textuser}
                                        success={success.textuser}
                                        isTextarea
                                    />
                                    <FormComponent
                                        label="Profile Image"
                                        type="file"
                                        name="image"
                                        onChange={handleFileChange}
                                        error={errors.image}
                                        success={success.image}
                                    />
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
                                </>
                            }
                        />
                    </div>

                    <div className="col-12 mt-4">
                        <CardComp
                            title="Your Threads"
                            content={
                                <ul>
                                    {createdThreads.map((thread) => (
                                        <li key={thread.idthread} style={{ listStyleType: 'disc', marginLeft: '20px', position: 'relative' }}>
                                            <a href="#" onClick={() => navigate(`/posts/${thread.idthread}/${thread.title}`)} style={{ textDecoration: 'none', color: "black" }}>{thread.title}</a>
                                            <a
                                                href="#"
                                                style={{ textDecoration: 'underline', color: "blue", position: 'absolute', right: '0' }}
                                                onClick={() => navigate(`/edit-thread/${thread.idthread}/${thread.title}`)}>
                                                Edit
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            }
                        />
                    </div>
                    <div className="col-12 mt-4">
                        <CardComp
                            title="Followed Threads"
                            content={
                                followedThreads.length > 0 ? (
                                    <ul>
                                        {followedThreads.map((thread) => (
                                            <li key={thread.idthread}>
                                                <a
                                                    href="#"
                                                    onClick={() => navigate(`/posts/${thread.idthread}/${thread.title}`)}
                                                    style={{ textDecoration: 'none', color: 'black' }}
                                                >
                                                    {thread.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>You are not following any threads yet.</p>
                                )
                            }
                        />
                    </div>

                    <div className="col-12 mt-4">
                        <CardComp
                            title="Your Posts"
                            content={
                                <>
                                    {postsState.length > 0 ? (
                                        postsState.map((post) => <PostCard key={post.idpost} post={post} onDelete={handleDeletePost} />)
                                    ) : (
                                        <p>You did not posted yet.</p>
                                    )}
                                </>
                            }
                        />
                    </div>

                </div>
            </div>
        </div>


    );
};

export default ProfileComponent;
