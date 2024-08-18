import Layout from '../components/Layout';
import PostCreationForm from '../components/PostCreation';


function NewPost() {


    return (
        <Layout
            Content=<PostCreationForm />
            headerText="New post"
        />

    );
}
export default NewPost;