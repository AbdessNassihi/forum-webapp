import Layout from '../../components/Layout';
import ThreadCreation from '../../components/threads/ThreadCreation';


function NewThread() {


    return (
        <Layout
            headerText="New thread"
            Content=<ThreadCreation />

        />

    );
}
export default NewThread;