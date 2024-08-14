
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCommentAlt } from '@fortawesome/free-regular-svg-icons';

import Styles from '../styles/Cards.module.css';



function PostCard() {

    return (

        <Card className={Styles.postcard}>
            <Card.Body>
                <div className={Styles['header-container']}>
                    <Card.Link href="#" className={Styles['card-link']}>u/ICantThinkOfOne376 -- 2u</Card.Link>
                    <Card.Link href="#" className={Styles['thread-title']}>Thread title</Card.Link>
                </div>
                <Card.Title>Shift Keys Not Working</Card.Title>
                <Card.Text>
                    Help please! I have been given a HP Laptop, of which I managed to reset. However, I am struggling to get any further with it as the '@' key and many other important symbols aren't working due to the shift key not working. When I press the Shift keys to generate the @ key, it doesn't work and remains as a '.'. Due to this I'm struggling to enter emails and passwords for anything making it basically unusable. Has anyone ever had this issue and what can I do to solve it? The laptop itself works fine so it's frustrating. It is a UK keyboard and the language settings are set to the UK. I don't think it's an issue with external damage to the keyboard because all the other keys work and both...
                </Card.Text>
            </Card.Body>
            <Card.Body>
                <Card.Link href="#" className={Styles['card-link']}><FontAwesomeIcon icon={faHeart} /> 1</Card.Link>
                <Card.Link href="#" className={Styles['card-link']}><FontAwesomeIcon icon={faCommentAlt} /> 1</Card.Link>
            </Card.Body>
        </Card>
    );
}

export default PostCard;
