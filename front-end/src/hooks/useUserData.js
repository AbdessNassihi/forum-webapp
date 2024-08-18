import { useState, useEffect } from 'react';
import { apiCall } from '../utils/Api';

const useUserData = (userId, navigate) => {
    const [userState, setUserState] = useState({
        isAdmin: 0,
        username: '',
        email: '',
        textuser: '',
        posts: [],
        createdThreads: [],
        followedThreads: [],
        numFollowers: 0,
        numFollowings: 0,
        profileImage: null,  // State for the profile image
        isLoading: true,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await apiCall('get', `/users/${userId}`);

                if (response.status === 200) {
                    const { user } = response.data;

                    setUserState(prevState => ({
                        ...prevState,
                        username: user.username,
                        isAdmin: user.isAdmin,
                        email: user.email,
                        textuser: user.textuser,
                        posts: user.posts,
                        createdThreads: user.createdThreads,
                        followedThreads: user.followedThreads,
                        numFollowers: user.numFollowers,
                        numFollowings: user.numFollowings,
                    }));


                    const imageResponse = await apiCall('get', `/users/${userId}/image`, null, { responseType: 'blob' });

                    if (imageResponse.status === 200) {

                        const imageUrl = imageResponse.data;
                        setUserState(prevState => ({
                            ...prevState,
                            profileImage: imageUrl,
                            isLoading: false,
                        }));
                    } else {
                        console.error('Failed to retrieve profile image');
                        setUserState(prevState => ({ ...prevState, isLoading: false }));
                    }

                } else {
                    navigate('/', { state: { showToast: true, message: 'User not found', toastType: 'error' } });
                }
            } catch (error) {
                navigate('/', { state: { showToast: true, message: 'An error occurred, try again later.', toastType: 'error' } });
                setUserState(prevState => ({ ...prevState, isLoading: false }));
            }
        };

        fetchUserData();
    }, [userId, navigate]);

    return userState;
};

export default useUserData;
