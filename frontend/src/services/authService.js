import React, { Component } from 'react'
import { Redirect } from "react-router-dom"
import Axios from 'axios';

export default function withAuth(AuthComponent){

    return class extends Component {
        constructor(){
            super()
            this.state = {
                redirect: false,
                loading: true
            }
        }

        componentDidMount() {
            Axios.get('/api/user/auth')
            .then(res=> {
                if(res.status === 200){
                    this.setState({loading: false})
                }else {
                    const error = new Error(res.error);
                    throw error;
                }
            }).catch(err => {
                this.setState({loading: false, redirect: true})
            })
        }
        
        render(){
            if(this.state.loading){
                return null;
            }
            if(this.state.redirect){
                return <Redirect to="/login" />;
            }
            return(
                <React.Fragment>
                    <AuthComponent {...this.props} />
                </React.Fragment>
            )
        }
    }
}