import React, {Component} from 'react'
import {Card, Button} from 'react-bootstrap'
import {Redirect} from 'react-router-dom'

class Login extends Component {

    constructor(props){
        super(props)
    }

    onSubmit = () => {

        let auth = true
        if(auth){
            return <Redirect to="/" />
        }
    }

    render(){
        return(
            <Card>
                <Card.Header>Login</Card.Header>
                <Card.Body>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input id="username" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input id="password" className="form-control"></input>
                        </div>
                        <Button type="submit">Submit</Button>
                    </form>
                </Card.Body>
            </Card>
        )
    }
} 