import Layout from '../../components/Layout';
import PostCreation from '../../components/posts/PostCreation';


function NewPost() {


    return (
        <Layout
            headerText="New post"
            Content=<PostCreation />

        />

    );
}
export default NewPost;