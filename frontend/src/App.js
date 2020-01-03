import React from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom'
import GoogleMap from "./components/googleMap";
import Login from "./components/login"
import withAuth from "./services/authService"
import axios from "axios";

axios.defaults.baseURL = 'http://ec2-52-206-198-221.compute-1.amazonaws.com/';


function App() {
  return (
    <div >
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="" component={withAuth(GoogleMap)}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
