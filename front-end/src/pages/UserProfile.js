import Layout from '../components/Layout';
import UserCardComponent from '../components/UserCard';
import { useParams } from 'react-router-dom';


function ProfileUser() {
    const { username } = useParams();

    return (
        <Layout
            headerText="User Profile"
            Content=<UserCardComponent username={username} />

        />

    );
}
export default ProfileUser;