import Layout from '../components/Layout';
import ThreadEditingForm from '../components/ThreadEditing';
import { useParams } from 'react-router-dom';


function UpdateThread() {
    const { idthread, title } = useParams();



    return (
        <Layout
            headerText="Edit your thread"
            Content=<ThreadEditingForm id={Number(idthread)} initialTitle={title} />

        />

    );
}
export default UpdateThread;