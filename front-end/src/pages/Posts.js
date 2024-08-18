import Layout from '../components/Layout';
import ThreadPostsComp from '../components/ThreadPosts';
import { useParams } from 'react-router-dom';


function Posts() {
    const { idthread, title } = useParams();


    return (
        <Layout
            headerText={`Thread: ${title}`}
            Content=<ThreadPostsComp idthread={Number(idthread)} title={title} />

        />

    );
}
export default Posts;