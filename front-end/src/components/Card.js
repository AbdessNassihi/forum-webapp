import React from 'react';
import BootstrapCard from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import Styles from '../styles/Cards.module.css';

const CardComp = ({ title, content, footer }) => {
    return (
        <BootstrapCard className={Styles.postcard}>
            <BootstrapCard.Body>
                {title && <h5 className="d-flex align-items-center mb-3">{title}</h5>}
                {content}
                {footer}
            </BootstrapCard.Body>
        </BootstrapCard>
    );
};

export default CardComp;
