import React, {Component} from 'react'
import {Card, Button} from 'react-bootstrap'
import Axios from 'axios';

class Login extends Component {

    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: ''
        }

        this.handleInputChange = this.handleInputChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
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

        Axios.post('api/user/auth', loginObj)
        .then(res => {
            if(res.status == 200){
                this.props.history.push('/')
            }
        }).catch(err => {
            alert("Error logging in! Please try again.")
        })
        
        
    }

    render(){
        return(
            <Card>
                <Card.Header>Login</Card.Header>
                <Card.Body>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input name="username" className="form-control" defaultValue={this.state.username} onChange={this.handleInputChange}></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input name="password" className="form-control" defaultValue={this.state.password} onChange={this.handleInputChange}></input>
                        </div>
                        <Button type="submit">Submit</Button>
                    </form>
                </Card.Body>
            </Card>
        )
    }
} 

export default Login