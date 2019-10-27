import React from 'react';
import {Switch, Route} from 'react-router-dom'
import GoogleMap from "./components/googleMap";
import Login from "./components/login"

function App() {
  return (
    <div >
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="" component={GoogleMap}/>
      </Switch>
    </div>
  );
}

export default App;
