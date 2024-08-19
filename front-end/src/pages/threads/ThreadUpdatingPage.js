import Layout from '../../components/Layout';
import ThreadUpdating from '../../components/threads/ThreadUpdatin';
import { useParams } from 'react-router-dom';


function UpdateThread() {
    const { idthread, title } = useParams();



    return (
        <Layout
            headerText="Edit your thread"
            Content=<ThreadUpdating id={Number(idthread)} initialTitle={title} />

        />

    );
}
export default UpdateThread;