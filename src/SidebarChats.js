import React from 'react'
import "./SidebarChats.css";
import {Avatar,IconButton,Badge} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import db from "./firebase";
import { Link , useHistory } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import firebase from "firebase";
import { uuid } from 'uuidv4';

function SidebarChats({id , name , addnewchat}) {

   const [seed,setSeed] = React.useState('');
   const [message,setMessage] = React.useState({});
   const [{user},dispatch] = useStateValue();
   const [adminId , setAdminId] = React.useState('');
   const history = useHistory();
   const[memberIds , setMemberIds]= React.useState([]);
   const [unseenMsg,setUnseenMsg]=React.useState(0);

    React.useEffect(()=>{
        var ismounted = true;
        if(ismounted)
        {
            setSeed(Math.floor(Math.random()*1000));
        }
       return ()=>{
           ismounted =false;
       }
      
       

    },[]);
    React.useEffect(()=>{
        var ismounted = true;
        
        if(id){
            db.collection('users').doc(user.uid).collection('roomIds').doc(id).onSnapshot(snapshot=>{
                const time =  snapshot.data()?.joinAt;
               
           if(time)
           {
            db.collection('message').doc(id).collection('messages').where('timestamp','>=',time).orderBy('timestamp','desc').limit(1).onSnapshot(snap=>{
               ismounted && setMessage(snap.docs[0]?.data());
    
               });
           }
          
        })   
        db.collection('rooms').doc(id).onSnapshot((snapshot)=>(
            ismounted && setAdminId(snapshot.data()?.adminId )
        ))
        db.collection('rooms').doc(id).onSnapshot(snapshot=>{
            ismounted &&  setMemberIds(snapshot.data()?.members)
        })
        
        db.collection('users').doc(user.uid).collection('roomIds').doc(id).onSnapshot(
            snapshot=>{
                ismounted && setUnseenMsg(snapshot.data()?.unreadMsg)
            }
        )
   
        }
        return ()=>{
            ismounted = false;
           
        }
       
    },[id]);
     
    const deleteRoom = (e)=>{
        e.preventDefault();
             if( adminId && id && user && adminId===user?.uid)
             {
                
           memberIds.map(userId=>{
            db.collection('users').doc(userId).collection('roomIds').doc(id).delete();
           })
            db.collection('rooms').doc(id).delete();     
             }
             else
             {
                 alert("only admin can delete room");
             }
       
    }
    const createChat=()=>{
       const roomName = prompt("Please enter name for chat room");
      
       if(roomName)
       {
          const roomId = uuid();
          
           db.collection("rooms").doc(roomId).set(
               {
                   name:roomName,
                   timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                   adminId : user.uid,  
                   id : roomId,
                   members:[user.uid],
                      
               }
           ) .then(()=>{
                db.collection("users").doc(user.uid).collection('roomIds').doc(roomId).set({
                    groupId : roomId,
                    unreadMsg : 0,
                    joinAt : firebase.firestore.FieldValue.serverTimestamp(),
              }).then(()=>{
                db.collection('message').doc(roomId).collection('messages').add(
                    {
                       name : null,
                       message: null,
                       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                       url:null,
                       fileName:null,
                       notification:`${user.displayName} created ${roomName}`,
                       deletedMsg : null,
                    }
                ) 
              }).catch(err=>console.log(err)) 
             
            }).catch(err=>{
              console.log(err);
            })
           
       }
    }
    return !addnewchat?(

        
       
        <div className="SidebarChats">
            <Link to={`/rooms/${id}`}>
          <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
          <div className="sidebarchat__info">
              <h2>{name}</h2> 
              <p>{message?.deletedMsg? message?.deletedMsg : message?.url?message?.fileName:message?.message&&message?.message }</p>
              </div></Link> 
              <div className="sidebarchat_right">
              <Badge color="secondary" badgeContent={unseenMsg}></Badge>
                  <IconButton onClick={deleteRoom}>
                      <DeleteIcon fontSize="small"/>
                 </IconButton></div>
        </div>
    ): <div className="SidebarChats" onClick={createChat}>
        <h2>Add new chat</h2>
           
  </div>
}

export default SidebarChats;
