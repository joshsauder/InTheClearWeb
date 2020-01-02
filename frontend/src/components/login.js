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
        this.state = {
            name: "",
            password: "",
            email: "",
            login: true
        }
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

    handleInputChange = (event) => {
        const target = event.target
        this.setState({
            [target.name]: target.value
        })
    }

    onSubmit = (event) => {
        event.preventDefault();
        const loginObj = {
            username: this.state.username, 
            password: this.state.password
        }

        Axios.post('api/user/auth', loginObj, {withCredentials: true})
        .then(res => {
            if(res.status == 200){
                //go to main page since access is granted
                this.props.history.push('/')
            }
        }).catch(err => {
            alert("Error logging in! Please try again.")
        })   
    }

    submitNewUser = (event) => {
        event.preventDefault();

        const userObj = {
            name: this.state.name,
            username: this.state.username, 
            password: this.state.password,
            email: this.state.email
        }

        Axios.post('api/user', userObj)
        .then(res => {
            if(res.status == 200){
                //show login form
                this.setState({login: true})
            }
        }).catch(err => {
            alert("There was an issue signing you up! Please try again.")
        })
    }

    onSignIn = (googleUser) => {

        const loginObj = {
            token: googleUser.getAuthResponse().id_token
        }

        Axios.post('api/user/auth/google', loginObj, {withCredentials: true})
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
        handleNewUser = (event) => {
            event.preventDefault()
            this.setState({login: false})
        }
        
        return(
            <LoginContainer>
            <div className="container">
                <div className="row justify-content-md-center mt-5">
                    <Card className="col-5">
                        <Card.Header className="headerFont">Login</Card.Header>
                        <Card.Body>
                            <div id="my-signin2" className="mb-2"></div>
                            <div id="appleid-signin" className="signin-button" data-color="black" data-border="true" data-type="sign in"></div>
                            {this.state.login ?
                                <form onSubmit={this.onSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input name="email" className="form-control" value={this.state.email} onChange={this.handleInputChange} required></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input name="password" type="password" className="form-control" value={this.state.password} onChange={this.handleInputChange} required></input>
                                    </div>
                                    <Button type="submit">Submit</Button>
                                    <Button type="button" onClick={this.handleNewUser} className="ml-2">Register</Button>
                                </form>
                                :
                                <form onSubmit={this.submitNewUser}>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Adress</label>
                                        <input name="email" className="form-control" defaultValue={this.state.password} onChange={this.handleInputChange} required></input>
                                        <small className="form-text text-muted">We will never share nor spam your Email Address</small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input name="password" className="form-control" defaultValue={this.state.password} onChange={this.handleInputChange} required></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="username">Name</label>
                                        <input name="name" className="form-control" defaultValue={this.state.name} onChange={this.handleInputChange} required></input>
                                    </div>
                                    <Button type="submit">Submit</Button>
                                </form>
                            }
                        </Card.Body>
                    </Card>
                </div>
            </div>
            </LoginContainer>
        )
    }
} 

export default Login