import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton (props){
    const [buttonMode, setButtonMode] = useState();
    useEffect (()=>{
        axios.get(`/friendshipStatus/${props.id}`).then(({data})=>{
            setButtonMode(data.buttonMode);
        }).catch(err=>{
            console.log("Error in FriendButton's useEffect function: ",err.message);
        });
    },[props.id]);
    function updateStatus(){
        axios.post(`/friendshipStatus`,{buttonMode:buttonMode,id:props.id}).then(({data})=>{
            setButtonMode(data.buttonMode);
        }).catch(err=>{
            console.log("Error in updateStatus function in FriendButton component: ",err.message);
        });
    }
    return (<button className="myButton" onClick={updateStatus}>{buttonMode}</button>);
}
