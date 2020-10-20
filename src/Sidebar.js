import React from "react";
import "./Sidebar.css";
import SidebarChats from "./SidebarChats";
import {Avatar,IconButton,Menu,MenuItem} from "@material-ui/core"
import ChatIcon from "@material-ui/icons/Chat";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import db from "./firebase";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";

function Sidebar()
{
 const [{user},dispatch] = useStateValue();
 const [rooms,setRooms] = React.useState([]);
 const [anchorEl, setAnchorEl] = React.useState(null);
 const handleClick = (event) => {
       
  setAnchorEl(event.currentTarget);
};

const handleClose = () => {
  setAnchorEl(null);
};
 const logOut = ()=>{

        
  firebase.auth().signOut().then(()=>{
      handleClose();
      
  
   console.log("sign out successfully");
  }).catch(err=>console.log(err));
 
}
 
  React.useEffect(()=>{
     
    let ismounted = true;
    
     db.collection('rooms').where('members','array-contains',user.uid).orderBy('timestamp',"desc").onSnapshot(snapshot=>{
      ismounted && setRooms(snapshot.docs.map(doc=>doc.data()));
     })
   
    return()=>{
      ismounted = false;
    }
    
  },[])
    return(
        <div className="Sidebar">
         
         <div className="sidebar__header">
        
         <Avatar src={user?.photoURL}/> 
        
         
          <div className="header__right">
              <IconButton>
                <DonutLargeIcon/>
              </IconButton>
              <IconButton>
                <ChatIcon/>
              </IconButton>
             <IconButton onClick={handleClick} aria-controls="simple-menu">
               <MoreVertIcon/>
               </IconButton> 
        
               <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={logOut}>Log Out</MenuItem>
        </Menu>
             
              </div>    
         </div>
         <div className="sidebar__search">
             <div className="sidebar__searchContainer">
             <SearchOutlinedIcon/>  
           <input placeholder="Search or start new chat" type="text"/>  
             </div>
           
        </div>
        <div className="sidebar__chats">
                <SidebarChats addnewchat/>
               {console.log(rooms),
                 rooms.map(room=> (
                   <SidebarChats key={room.id} id={room.id}
                   name={room.name}/>
                 ))
               }
        </div>

        </div>
    );
}
export default Sidebar;