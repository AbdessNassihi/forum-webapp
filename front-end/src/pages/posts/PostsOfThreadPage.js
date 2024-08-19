import Layout from '../../components/Layout';
import PostsOfThread from '../../components/posts/PostsOfThread';
import { useParams } from 'react-router-dom';


function ThreadPosts() {
    const { idthread, title } = useParams();


    return (
        <Layout
            headerText={`Thread: ${title}`}
            Content=<PostsOfThread idthread={Number(idthread)} title={title} />

        />

    );
}
export default ThreadPosts;