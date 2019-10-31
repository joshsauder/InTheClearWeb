import React, {component} from 'react';
import '../style/login.css'
import logo from '../images/InTheClear.png'
import background from '../images/background.jpg'

const LoginContainer = (props) => {

    return(
        <div>
            <img src={background} style={{position: "fixed"}}></img>
            <img className="mx-auto d-block img-logo mb-1" style={{position: "relative"}} alt="logo" src={logo}></img>
            {props.children}
        </div>
    )
}

export default LoginContainer;