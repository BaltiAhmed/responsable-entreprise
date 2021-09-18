import React, { useEffect, useState } from "react";
import {Modal,Button} from 'react-bootstrap'

const ServiceModal = (props)=>{
  const [list, setList] = useState();
  const [error, seterror] = useState(null);
  const [success, setsuccess] = useState(null);

  useEffect(() => {

    const sendRequest = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/service/${props.id}`
        );

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setList(responseData.service);
      } catch (err) {
        seterror(err.message);
      }
    };

    sendRequest();
  }, [props.id]);

    return(
        <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
         {list && list.nom}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{list && list.type}</h5>
        <h5>{list && list.prix} DT</h5>
        <p>
        {list && list.description}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
    )
}

export default ServiceModal