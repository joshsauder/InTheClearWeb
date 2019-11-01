import React, {component} from 'react';
import '../style/login.css'
import logo from '../images/InTheClear.png'

const LoginContainer = (props) => {

    return(
        <div className="imageBackground">
            <img className="mx-auto d-block img-logo mb-1 mt-3" style={{position: "relative"}} alt="logo" src={logo}></img>
            {props.children}
        </div>
    )
}

export default LoginContainer;