import React from "react";
import {
    Link
  } from "react-router-dom";
function test() { 
    console.log("For testing rogue code.");      
}
function Landing() {
   
    return(
        <div>
            <h1 onClick={test}>This is the CAC landing page!</h1>
            <Link to="/login">
                <h3>Click here to Login!</h3>
            </Link>
        </div>
    );
}

export default Landing;