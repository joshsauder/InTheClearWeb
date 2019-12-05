import React from 'react';
import {Modal, Button} from "react-bootstrap"
import '../../style/TripStops.css'
import 'flatpickr/dist/themes/material_green.css'


export default function TripStopsModal(props){
    return (
        <Modal className="modalPurple" show = {props.show} onHide={props.hide}>
            <Modal.Header closeButton>
                <Modal.Title>Trip Stops</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {props.children}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onSubmit}>Set Stops</Button>
            </Modal.Footer>
        </Modal>
    )
}