import Layout from '../../components/Layout';
import UserCard from '../../components/profile/UserCard';
import { useParams } from 'react-router-dom';


function ProfileMember() {
    const { username } = useParams();

    return (
        <Layout
            headerText="User Profile"
            Content=<UserCard username={username} />

        />

    );
}
export default ProfileMember;