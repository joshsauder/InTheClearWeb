import React, {Component} from 'react';
import {Modal, Form} from "react-bootstrap"

class TripStops extends Component {

    constructor(props){
        super(props)

    }


    render(){
        return(
            <Modal>
                <Modal.Header closeButton>
                    <Modal.Title>Trip Stops</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Control type="stop" placeholder="Enter Stop" />
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}