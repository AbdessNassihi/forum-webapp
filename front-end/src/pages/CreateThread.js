import Layout from '../components/Layout';
import ThreadCreationForm from '../components/ThreadCreation';


function NewThread() {


    return (
        <Layout
            Content=<ThreadCreationForm />
            headerText="New post"
        />

    );
}
export default NewThread;