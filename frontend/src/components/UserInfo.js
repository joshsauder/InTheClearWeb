import React, {Component} from 'react';

class UserInfo extends Component {

    constructor(){
        super(props)
    }

    render(){
        return (
            <div className="row card">
                <div>Hello! {this.props.name.firstName}</div>
                <div>Logout</div>
            </div>
        )
    }
}