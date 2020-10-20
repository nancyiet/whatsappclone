import React from 'react';
import './App.css';
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import {BrowserRouter as Router , Switch, Route  } from 'react-router-dom';
import Login from "./Login";
import { useStateValue } from './StateProvider';
import { auth } from './firebase';
import {Action_Types} from "./reducer";
import db from "./firebase"
import firebase from "firebase"
import { Offline, Online } from "react-detect-offline";
import ReportProblemIcon from '@material-ui/icons/ReportProblem';

function App() {

  
  const [{user} , dispatch] = useStateValue();
  const [room , setRoom] = React.useState(null);
  const saveUserToDb = (user)=>{
         
    db.collection('users').doc(user.uid).set({
        username : user.displayName,
        email : user.email,
        userId : user.uid,
        url : user.photoURL,
        
    })
}



  
 
  React.useEffect(()=>{
    var ismounted = true;

    ismounted &&  auth.onAuthStateChanged((user)=> {
     
      if (user) {
        // User is signed in.
        dispatch({
          type: Action_Types.SET_USER,
          user: user,
         })
         saveUserToDb(user);
         
        }
      else
      {
        dispatch({
          type: Action_Types.SET_USER,
          user: null,
         })
 
      }
     
    });
    return ()=>{
      
      ismounted=false;
      
    }
    

  },[dispatch]);
  const RenderChat = ({match})=>{
    var roomId=match.params.roomId;
   
   
     db.collection('users').doc(user.uid).collection('roomIds').doc(match.params.roomId).onSnapshot(
       snapshot=> snapshot.data()?setRoom(roomId):setRoom(null)
     )
     
      
       return <Chat roomId = {room}/>
  }
  return (
    
    <div className="App">
     
      <Offline>
        <div className="offline">
        <ReportProblemIcon />
        <h3>Oops! Something went wrong.</h3>
        <p>Check your internet connection</p>
      </div>
         </Offline>
      <Online>
     { user ? 
     <div className="app__body">
    
       <Router>
       <Sidebar/>
         <Switch>
         <Route path="/rooms/:roomId" component={RenderChat} />
            
           <Route path="/" >
             </Route>
          
             
           
        
         </Switch>
      
       </Router>
    
     </div>: (<Login/>)}</Online>
    </div>) 
  
}

export default App;
