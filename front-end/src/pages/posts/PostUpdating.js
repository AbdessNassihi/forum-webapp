import Layout from '../../components/Layout';
import PostUpdating from '../../components/posts/PostUpdating';
import { useParams } from 'react-router-dom';


function UpdatePost() {
    const { idpost, title, content } = useParams();



    return (
        <Layout
            headerText="Edit your post"
            Content=<PostUpdating id={Number(idpost)} title={title} initialContent={content} />

        />

    );
}
export default UpdatePost;