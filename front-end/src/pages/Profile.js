import { useContext } from 'react';
import Layout from '../components/Layout';
import UserProfile from '../components/ProfileForm';
import { UserContext } from '../context/UserContext';


function Profile() {
    const { loading } = useContext(UserContext);

    return (
        <Layout
            headerText="Profile"
            Content={
                loading ? (<div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>) :
                    (<UserProfile />)

            }

        />
    );
}

export default Profile;