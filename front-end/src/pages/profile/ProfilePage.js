import { useContext } from 'react';
import Layout from '../../components/Layout';
import ProfileComponent from '../../components/profile/ProfileComponent';
import { UserContext } from '../../context/UserContext';


function Profile() {
    const { loading } = useContext(UserContext);

    return (
        <Layout
            headerText="Profile"
            Content={
                loading ? (<div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>) :
                    (<ProfileComponent />)

            }

        />
    );
}

export default Profile;