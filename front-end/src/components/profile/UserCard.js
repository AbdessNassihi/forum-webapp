import React, { useState, useEffect, useContext } from 'react';
import CardComp from '../Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Def_profile from '../../img/default_ProfileImage.png';
import { apiCall } from '../../services/api';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import useUserData from '../../hooks/useUserData';

const UserCard = ({ username }) => {
    const navigate = useNavigate();
    const { user, loading } = useContext(UserContext);
    const { isAdmin } = useUserData(user, navigate);
    const [userData, setUserData] = useState({
        iduser: null,
        is_admin: 0,
        email: '',
        textuser: '',
        numFollowers: 0,
        numFollowings: 0,
        profileImage: null,
    });
    const [loadingUserInfo, setLoadingUserInfo] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const response = await apiCall('get', `/users/username/${username}`);
                    if (response.status === 200) {
                        const { iduser, email, textuser, num_followers, num_followings, is_following, is_admin } = response.data.user;
                        setUserData(prevState => ({
                            ...prevState,
                            iduser,
                            is_admin,
                            email,
                            textuser,
                            numFollowers: num_followers,
                            numFollowings: num_followings,
                        }));
                        setIsFollowing(!!is_following);

                        if (iduser === user) navigate('/profile');

                        const imageResponse = await apiCall('get', `/users/${iduser}/image`, null, { responseType: 'blob' });

                        if (imageResponse.status === 200) {
                            const imageUrl = imageResponse.data;
                            setUserData(prevState => ({
                                ...prevState,
                                profileImage: imageUrl,
                            }));
                        } else {
                            toast.error('Profile image not found', { hideProgressBar: true, autoClose: 2000 });
                        }
                    } else {
                        toast.error('User not found', { hideProgressBar: true, autoClose: 2000 });
                    }
                } catch (error) {
                    toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
                } finally {
                    setLoadingUserInfo(false);
                }
            }
        };

        fetchUserData();
    }, [username, user, navigate]);

    const handleFollow = async () => {
        try {
            let response;
            if (!isFollowing) {
                response = await apiCall('post', `/follow/${userData.iduser}/`);
            }
            else {
                response = await apiCall('delete', `/follow/${userData.iduser}/`);
            }

            if (response.status === 200) {
                setIsFollowing(!isFollowing);
                setUserData(prevState => ({
                    ...prevState,
                    numFollowers: isFollowing ? prevState.numFollowers - 1 : prevState.numFollowers + 1,
                }));
            } else {
                toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    const handleSetAdmin = async () => {
        try {
            const response = await apiCall('put', `/users/${userData.iduser}/admin`);
            if (response.status === 200) {
                setUserData(prevState => ({
                    ...prevState,
                    is_admin: 1,
                }));
                toast.success('User set as admin', { hideProgressBar: true, autoClose: 2000 });
            } else {
                toast.error('Failed to set user as admin', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    const handleDeleteUser = async () => {
        try {
            const response = await apiCall('delete', `/users/${userData.iduser}`);

            if (response.status === 200) {
                navigate('/', {
                    state: {
                        showToast: true,
                        message: response.data.message,
                        toastType: 'success'
                    }
                });
            } else {
                toast.error('Failed to delete user', { hideProgressBar: true, autoClose: 2000 });
            }
        } catch (error) {
            toast.error('A server side error has occured.', { hideProgressBar: true, autoClose: 2000 });
        }
    };

    if (loadingUserInfo || loading) {
        return (
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        );
    }

    return (
        <CardComp
            content={
                <>
                    <div className="d-flex flex-column align-items-center text-center">
                        <img
                            src={userData.profileImage ? URL.createObjectURL(userData.profileImage) : Def_profile}
                            alt="Profile"
                            className="rounded-circle p-1 bg-primary"
                            width="110"
                        />
                        <div className="mt-3">
                            <h4>
                                {username}
                                {userData.is_admin ? (<span className="text-secondary">{' '}(Admin)</span>) : (null)}
                            </h4>
                            <p className="text-secondary mb-1">{userData.email}</p>
                            <p className="text-secondary mb-1">{userData.textuser}</p>
                        </div>
                    </div>
                    <hr className="my-4" />
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0">
                                Followers
                                <span style={{ marginLeft: '1.5em' }}>
                                    <Badge className="badge-spacing" bg="secondary">{userData.numFollowers}</Badge>
                                </span>
                            </h6>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                            <h6 className="mb-0">
                                Followings
                                <span style={{ marginLeft: '1em' }}>
                                    <Badge className="badge-spacing" bg="secondary">{userData.numFollowings}</Badge>
                                </span>
                            </h6>
                        </li>
                    </ul>
                </>
            }
            footer={
                <div className="text-center">
                    <Button variant="primary" onClick={handleFollow} className="mx-2">
                        {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                    {userData.is_admin === 0 && isAdmin && (
                        <>
                            <Button variant="primary" className="mx-2" onClick={handleSetAdmin}>
                                Set as admin
                            </Button>
                            <Button variant="primary" className="mx-2" onClick={handleDeleteUser}>
                                Delete user
                            </Button>
                        </>
                    )}
                </div>
            }
        />
    );
};

export default UserCard;
