import React, {Component} from 'react';
import {Card, Button} from 'react-bootstrap';
import axios from 'axios';

class UserInfo extends Component {

    constructor(props){
        super(props)
    }

    deleteCookie = () => {
        axios.get('/api/user/auth/logout').then(()=> {
            window.location.reload()
        })
    }

    render(){
        return (
            <div className="mr-3">
                <div className="text-white mb-2">Hello! {this.props.name ? this.props.name.firstName : ""}</div>
                <Button onClick={this.deleteCookie}>Logout</Button>
            </div>
        )
    }
}

export default UserInfo;