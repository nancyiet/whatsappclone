import React from 'react'
import "./Chat.css";
import {Avatar,IconButton,LinearProgress,Menu , MenuItem,Collapse,ListItemAvatar,ListItem,ListItemText,List,Badge} from "@material-ui/core"
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import  InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import PersonAddIcon from "@material-ui/icons/PersonAdd"
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {  useHistory } from 'react-router-dom';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import db from "./firebase";
import { useStateValue } from './StateProvider';
import firebase from "firebase";
import {storage}from "./firebase";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

function Chat({roomId}) {
    
    const [input , setInput] = React.useState('');
    const [seed,setSeed] = React.useState('');
    //const {roomId} = useParams();
    const [roomName , setRoomName] = React.useState('');
    const [messages , setMessages] = React.useState([]);
    const [{user},dispatch] = useStateValue();
    const [progress,setProgress]=React.useState(0);
    const [adminId , setAdminId] = React.useState("");
    const [members , setMembers] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open , setOpen] = React.useState(false);
    const [memberDetails , setMemberDetails]= React.useState([]);
    const [emojiToggler , setEmojiToggler] = React.useState(false);
    const [ID,setID]=React.useState(null);
    var containerRef = React.useRef(null);
    const history = useHistory();
    const handleClick = (event) => {
       
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  const openMembers = ()=>{
      setOpen(!open);
  }

   React.useEffect(()=>{
     setID(roomId);
  },[])
  React.useEffect(()=>{
      if(roomId===null)
      {
          history.push("/");
      }
  },[])
  const addMember = ()=>{
        
    var mail_id = prompt("enter valid email id of new member");
    
    if(mail_id && roomId )
    {
         db.collection('users').where('email','==',mail_id).onSnapshot(snap=>{
            if(snap.docs.length)
            {
                const friendId = snap.docs[0].id;
                const friend = snap.docs[0].data().username;
        db.collection('users').doc(friendId).collection('roomIds').doc(roomId).get().then((docsSnap=>{
            if(docsSnap.exists)
            {
               alert(`${friend} already exists`);
            }
            else
            {
          
            db.collection('users').doc(friendId).collection('roomIds').doc(roomId).set({
                groupId : roomId,
                unreadMsg : 1,
                joinAt : firebase.firestore.FieldValue.serverTimestamp(),
            }).then(()=>{
                var ref = db.collection('rooms').doc(roomId);
                ref.update({
                    members : firebase.firestore.FieldValue.arrayUnion(friendId)
                })
                 .then(()=>{
                    db.collection('message').doc(roomId).collection('messages').add(
                        {
                           name : null,
                           message: null,
                           timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                           url:null,
                           fileName:null,
                           notification:`${user.displayName} added ${friend}`,
                           deletedMsg : null,
                        }
                    )  
                    members.map(id=>{
                        if(id!==user.uid)
                        {
                         db.collection('users').doc(id).collection('roomIds').doc(roomId).update({
                             unreadMsg: firebase.firestore.FieldValue.increment(1),
                         })
                        }
                       
                    })
         
                    db.collection('rooms').doc(roomId).update({
                      
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        
                     })
                     
                 
             }).catch(err=>console.log(err))
                  }).catch(err=>console.log(err));
                    
        
                 
                }
            })) 
            
        }
        else
        {
            alert(" No user is found with this Email Id....")
        }
    })}
         
        
         
    }
   
  
  React.useEffect(()=>{
     var ismounted = true;
    if(roomId)
    {


         db.collection('rooms').doc(roomId).onSnapshot(snap=>{
            ismounted && setAdminId(snap.data()?.adminId);
         })
         
         db.collection('rooms').doc(roomId).onSnapshot(snapshot=>{
            
         var members = snapshot.data()?.members;
         ismounted &&  setMembers(members);
        
         ismounted &&  setMemberDetails([]);
        
         if(members && members.length)
         {
            members.map(member =>
                db.collection('users').doc(member).onSnapshot(
                    snapshot=>ismounted && setMemberDetails(prev=>[...prev , {data : 
                        snapshot.data()} ]
                       ))
                        ) 
         }
   
    
        })
         
        
    }
    return()=>{
      ismounted=false;
    }
           
  },[roomId])

  React.useEffect(()=>{
      if(ID)
      {
        db.collection('users').doc(user.uid).collection('roomIds').doc(ID).update({
            unreadMsg: 0,
        })
      }
   
  },[messages])

  React.useEffect(()=>{
      var ismounted = true;
      if(roomId)
      {
        db.collection('users').doc(user.uid).collection('roomIds').doc(roomId).onSnapshot(snapshot=>{
            const time =  snapshot.data()?.joinAt;
            
          if(time)
          {

                
        db.collection('message').doc(roomId).collection('messages').where('timestamp','>=',time).orderBy('timestamp',"asc").onSnapshot((snapshot)=>
        {
            ismounted &&  setMessages(snapshot.docs.map((doc)=>(
                {
                    data : doc.data(),
                    id : doc.id,
                }
            ) 
            
            ))
            
            
            })
        }
        
     }) 
      }
      return()=>{
        ismounted = false;
      }
  } , [roomId])
    React.useEffect( ()=>{
         var ismounted = true;
        if(roomId)
        {

             db.collection('rooms').doc(roomId).onSnapshot((snapshot)=>{
                 
                ismounted && setRoomName(snapshot.data()?.name);
            })
             
            
                
               
   
            
        }
        return()=>{
            ismounted = false;
        }
        
    },[roomId])

    React.useEffect(()=>{
        var ismounted = true;

      ismounted &&  setSeed(Math.floor(Math.random()*1000));
        return()=>{
            ismounted = false;
        }
    },[roomId]);
   
    React.useEffect(() => {

        if(containerRef && containerRef.current) {
          const element = containerRef.current;
          
          element.scroll({
            top: element.scrollHeight,
            left: 0,
            behavior: "instant"
          })
        }
  
      }, [containerRef, messages])
    const deleteChat = (e,msgId,name)=>{
            
        e.preventDefault();
          if(roomId && user.displayName===name)
          {
             
            
            db.collection('message').doc(roomId).collection('messages').doc(msgId).update({
                deletedMsg : "this message has been deleted",
            })
                
    
          }
       
    }
    const sendMessage = (event)=>{
           event.preventDefault();
           
          if(roomId)
          {

         
           db.collection('message').doc(roomId).collection('messages').add(
               {
                  name : user.displayName,
                  message: input,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  url:null,
                  fileName:null,
                  notification:null,
                  deletedMsg : null,
               }
           )
           
           db.collection('rooms').doc(roomId).update({
              
               timestamp:firebase.firestore.FieldValue.serverTimestamp(),
           })
           members.map(id=>{
               if(id!=user.uid)
               {
                db.collection('users').doc(id).collection('roomIds').doc(roomId).update({
                    unreadMsg: firebase.firestore.FieldValue.increment(1),
                })
               }
              
           })
        }
           setInput("");
    }
    const sendFile = (f)=>{
        
       
        if(roomId)
        {

       
        const storageRef = storage.ref(`create/${f.name}`).put(f);
        storageRef.on('state_changed',(snapshot)=>{
            const progress= Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
            setProgress(progress);
        },
        (error)=>{
            console.log(error);
        },()=>{
            storage.ref("create")
            .child(f.name)
            .getDownloadURL()
            .then((url)=>{
                console.log(url);
                db.collection('message').doc(roomId).collection('messages').add(
                    {
                       name : user.displayName,
                       message: null,
                       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                       url:url,
                       fileName:f.name,
                       notification:null,
                       deletedMsg : null,
                    }
                )
                setProgress(0);
                db.collection('rooms').doc(roomId).update({
                   
                    timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                })
                members.map(id=>{
                    if(id!=user.uid)
                    {
                     db.collection('users').doc(id).collection('roomIds').doc(roomId).update({
                         unreadMsg: firebase.firestore.FieldValue.increment(1),
                     })
                    }
                   
                })
                
            })
        }) 
    }
    }
    const removeMember = (userId,userName)=>{
        if(roomId && adminId && user?.uid === adminId && user?.uid !==userId)
        {
            if(window.confirm("you wanna remove this member?"))
            {
                db.collection('rooms').doc(roomId).update({
                    members : firebase.firestore.FieldValue.arrayRemove(userId)
                })
                db.collection('users').doc(userId).collection('roomIds').doc(roomId).delete();
                db.collection('message').doc(roomId).collection('messages').add(
                    {
                       name : null,
                       message: null,
                       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                       url:null,
                       fileName:null,
                       notification:`${user.displayName} removed ${userName}`,
                       deletedMsg : null,
                    }
                )
            }
        }
        else
        {
            alert("Not Allowed!");

        }
        
    }
    
    const logOut = ()=>{

        
        firebase.auth().signOut().then(()=>{
            handleClose();
            
        
         console.log("sign out successfully");
        }).catch(err=>console.log(err));
       
    }
    const leaveChat = ()=>{
         if(roomId)
         {

        
         if(adminId !== user.uid)
         {
            db.collection('users').doc(user.uid).collection('roomIds').doc(roomId).delete().then(()=>{
                var ref = db.collection('rooms').doc(roomId);
                ref.update({
                    members : firebase.firestore.FieldValue.arrayRemove(user.uid)
                }).then(()=>history.push("/")).catch(err=>console.log(err))}
                  ).catch(err=>console.log(err));
                  db.collection('message').doc(roomId).collection('messages').add(
                    {
                       name : null,
                       message: null,
                       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                       url:null,
                       fileName:null,
                       notification:`${user.displayName} left`,
                       deletedMsg : null,
                    }
                )
                members.map(id=>{
                    if(id!=user.uid)
                    {
                     db.collection('users').doc(id).collection('roomIds').doc(roomId).update({
                         unreadMsg: firebase.firestore.FieldValue.increment(1),
                     })
                    }
                   
                })
        
         }
         else
         {
             alert("admin can not leave chat room");
         }
        }
    }
   
    return (
        <div className="chat">
         <div className="chat__header">
         <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
         <div className="chat__headerInfo">
            <h3>{roomName}</h3>
            {messages.length ? <p>last seen at {new Date(messages[messages.length-1]?.data.timestamp?.toDate()).toUTCString()}</p>: <p></p>}
         </div>
         <div className = "chat__headerRight">
           <IconButton>
               <SearchOutlinedIcon/>
           </IconButton>
               <IconButton onClick={addMember}>
                   <PersonAddIcon />
               </IconButton>
               <IconButton onClick={handleClick} aria-controls="simple-menu">
               <MoreVertIcon/>
               </IconButton> </div>
         </div>
               <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={leaveChat}>Leave Chat</MenuItem>
        <MenuItem onClick={logOut}>Logout</MenuItem>
        <MenuItem onClick={openMembers}>Members {open ? <ExpandLess /> : <ExpandMore />}</MenuItem>
      <Collapse in={open}>
       <List>
           {
               
               memberDetails.map(member=>(
                <ListItem key={member?.data.userId}>
                <ListItemAvatar>
                    <Avatar alt={member?.data.username} src={member?.data.url} />
                </ListItemAvatar>
               <ListItemText primary={member?.data.username} />
              
              <IconButton onClick={()=>removeMember(member?.data.userId,member?.data.username)}>
              <RemoveCircleIcon/> 
                  </IconButton> 
            </ListItem>
               ))
           }
          
         
       </List>
       </Collapse>
      </Menu>
               
        
       
         <div className="chat__body" ref={containerRef} >
             {messages.map(message=>( message.data.notification?
                 <div key={message.id}className="chat__notification">
                     <p > 
                   {message.data.notification}
                 </p>
                     </div>
              
                :<p  className={`chat__message ${message.data.name===user.displayName && "chat__reciever" }`} key={message.id}> 
                <span className="chat__name"> {message.data.name}  </span>
                  {message.data.deletedMsg?message.data.deletedMsg : message.data.url?<img src={message.data.url} alt={message.data.fileName}/>:message.data.message} 
                 <span className="chat__timeStamp">{new Date(message.data.timestamp?.toDate()).toUTCString()} </span> {
                     message.data.deletedMsg === null && message.data.name===user.displayName && <IconButton 
                     onClick={(e)=>deleteChat(e,message.id,message.data.name)}>
                     <DeleteIcon fontSize="small"/>
                     </IconButton>
                 } 
                </p>
                
             ))}
           
         </div> 
        
         <LinearProgress variant="determinate" value={progress} />
         {emojiToggler && <Picker style={{"width":"100%", "overflow":"hidden","height":"250px"}} onSelect={(e)=>{
             let sym = e.unified.split('-')
             let codesArray = []
             sym.forEach(el => codesArray.push('0x' + el))
             let emoji = String.fromCodePoint(...codesArray)
            
             setInput(input + emoji);
         }
         }
         emojiTooltip={true}
         title=""
         />}
         <div className="chat__footer">
         
         
         <IconButton onClick={()=>setEmojiToggler(!emojiToggler)}>
         <InsertEmoticonIcon/>
         </IconButton>
         
              <form >    
               <input  value = {input} onChange={(e)=>setInput(e.target.value)} type="text" placeholder="Type a message"/>
               <button type="submit" onClick={sendMessage}>Send a message</button>
              </form>
              <IconButton >
              
                  <input type="file" id="fileInput" onChange={(e)=>{
                     window.confirm("wanna send ?")&& sendFile(e.target.files[0])}}/>
              <label htmlFor="fileInput"><AttachFileIcon  /></label>
              </IconButton>

         </div>
         
        </div>
    )
}

export default Chat
