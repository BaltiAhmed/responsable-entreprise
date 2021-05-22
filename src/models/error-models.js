import React from "react";
import {  Alert } from 'react-bootstrap';

export default function ErrorModel(props) {
 
    return (
        <>
            <Alert variant="danger" show={!!props.error}  >
                {props.error}
            </Alert>
        </>
    );
}
