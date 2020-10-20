import React from 'react'
import { Button } from '@material-ui/core';
import "./Login.css";
import img from "./images/img.png";
import  {auth, provider} from "./firebase";



function Login() {
   

   
          
    const signIn = ()=>{
       
      
        auth.signInWithPopup(provider).then(result=>{
           
             console.log("sign up successfully");
            
            
        }).catch(err=>alert(err.message));

   
    }
    
    return (
        <div className="login">
           <div className="login__container">
             <img src={img}
             alt = "whatsappImg"/>
             <div className="login__text">
             <h1>Sign in to WhatsApp</h1>
             </div>
             <Button  onClick={signIn} style={{backgroundColor: "#0a8d48"}}>
                 Sign In With Google
             </Button>
           </div>
        </div>
    )
}

export default Login
