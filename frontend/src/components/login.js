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
            username: "",
            password: "",
            email: "",
            login: true
        }
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

    handleNewUser = (event) => {
        //prevent default to prevent form submission
        event.preventDefault()
        //show register form
        this.setState({login: false})
    }

    render(){
        return(
            <LoginContainer>
            <div className="container">
                <div className="row justify-content-md-center mt-5">
                    <Card className="col-5">
                        <Card.Header className="headerFont">{this.state.login ? "Login" : "Register" }</Card.Header>
                        <Card.Body>
                        {this.state.login ?
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input name="username" className="form-control" value={this.state.username} onChange={this.handleInputChange}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input name="password" type="password" className="form-control" value={this.state.password} onChange={this.handleInputChange}></input>
                                </div>
                                <Button type="submit">Submit</Button>
                                <Button type="button" onClick={this.handleNewUser} className="ml-2">Register</Button>
                            </form>
                            :
                            <form onSubmit={this.submitNewUser}>
                                <div className="form-group">
                                    <label htmlFor="username">Name</label>
                                    <input name="name" className="form-control" defaultValue={this.state.name} onChange={this.handleInputChange}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input name="username" className="form-control" defaultValue={this.state.username} onChange={this.handleInputChange}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input name="password" className="form-control" defaultValue={this.state.password} onChange={this.handleInputChange}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Adress</label>
                                    <input name="email" className="form-control" defaultValue={this.state.password} onChange={this.handleInputChange}></input>
                                    <small className="form-text text-muted">We will never share nor spam your Email Address</small>
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