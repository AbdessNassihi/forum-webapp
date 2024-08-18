import Layout from '../components/Layout';
import PostEditingForm from '../components/PostEditing';
import { useParams } from 'react-router-dom';


function UpdatePost() {
    const { idpost, title, content } = useParams();



    return (
        <Layout
            headerText="Edit your post"
            Content=<PostEditingForm id={Number(idpost)} title={title} initialContent={content} />

        />

    );
}
export default UpdatePost;