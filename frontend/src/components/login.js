import React, {Component} from 'react'
import {Card, Button} from 'react-bootstrap'

class Login extends Component {

    constructor(props){
        super(props)
    }


    render(){
        return(
            <Card>
                <Card.Header>Login</Card.Header>
                <Card.Body>
                    <form>
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