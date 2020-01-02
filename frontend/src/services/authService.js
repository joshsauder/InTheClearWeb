import React, { Component } from 'react'
import { Redirect } from "react-router-dom"
import Axios from 'axios';

export default function withAuth(AuthComponent){

    return class extends Component {
        constructor(){
            super()
            this.state = {
                redirect: false,
                loading: true,
                id: "",
                name: ""
            }
        }

        componentDidMount() {
            Axios.get('/api/user/auth', {withCredentials: true})
            .then(res=> {
                if(res.status === 200){
                    this.setState({loading: false, id: res.data.id, name: res.data.name})
                }else {
                    const error = new Error(res.error);
                    throw error;
                }
            }).catch(err => {
                this.setState({loading: false, redirect: true})
            })
        }
        
        render(){
            //if not authenticated redirect to login... else grant access
            if(this.state.loading){
                return null;
            }
            if(this.state.redirect){
                return <Redirect to="/login" />;
            }
            return(
                <React.Fragment>
                    <AuthComponent {...this.props} id={this.state.id} name={this.state.name} />
                </React.Fragment>
            )
        }
    }
}