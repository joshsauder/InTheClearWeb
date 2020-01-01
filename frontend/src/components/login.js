/* global gapi */
/* global AppleID */
import React, {Component} from 'react'
import {Card, Button} from 'react-bootstrap'
import LoginContainer from './loginContainer'
import Axios from 'axios';
import "../style/login.css"

class Login extends Component {

    constructor(props){
        super(props)
    }

    componentDidMount() {
        gapi.signin2.render('my-signin2', {
            'scope': 'profile email',
            'width': 240,
            'height': 50,
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': this.onSignIn,
        });

        AppleID.auth.init({
            clientId : 'com.intheclear.birdhouseWeb',
            scope : 'name email',
            redirectURI: 'https://intheclearbackend.herokuapp.com/api/user/auth/apple',
            state : 'state'
        });
    }

    onSignIn = (googleUser) => {
        var profile = googleUser.getBasicProfile();

        const loginObj = {
            token: googleUser.getAuthResponse().id_token
        }

        return Axios.post('api/user/auth/google', loginObj, {withCredentials: true})
        .then(res => {
            if(res.status == 200){
                //go to main page since access is granted
                this.props.history.push('/')
            }
        }).catch(err => {
            alert("Error logging in! Please try again.")
        })  
    }

    render(){
        return(
            <LoginContainer>
            <div className="container">
                <div className="row justify-content-md-center mt-5">
                    <Card className="col-5">
                        <Card.Header className="headerFont">Login</Card.Header>
                        <Card.Body>
                            <div id="my-signin2" className="mb-2"></div>
                            <div id="appleid-signin" className="signin-button" data-color="black" data-border="true" data-type="sign in"></div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            </LoginContainer>
        )
    }
} 

export default Login