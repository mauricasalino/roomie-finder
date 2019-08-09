import React, { useEffect, useRef } from 'react';
import { socket } from './socket';
import { useSelector } from 'react-redux';
// import axios from './axios';

export default function Wall (props) {

    console.log("props", props.OtherId);
    let wallId = props.OtherId;

    const wallPosts = useSelector(
        state => state && state.post
    );
    console.log("wallPosts wall.js", wallPosts);

    const elemRef = useRef();

    useEffect(() => {
        console.log("mounted!");
        elemRef.current.scrollTop = elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [wallPosts]);

    const keyCheck = (e) => {
        if(e.key === "Enter") {
            e.preventDefault();
            console.log(e.target.value);
            socket.emit('wallpost', e.target.value, {
                receiver_id: wallId
            });
            e.target.value = "";
        }
    };

    return (
        <div>
            <h1>Wall Post's</h1>
            <div className="chat-container" style={{height: "40vh"}} ref = { elemRef }>
                {wallPosts && wallPosts.map(
                    val => (
                        <div className="wallpost" key={val.id}>
                            {val.wall} said &nbsp;
                            {val.first}
                        </div>
                    )
                )}
            </div>
            <textarea
                placeholder = "Leave a wall message"
                onKeyDown = { keyCheck }
                style ={{width: "40vw", height: "8vh"}}
            />
        </div>
    );

}
