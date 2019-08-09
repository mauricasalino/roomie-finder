import React, { useEffect, useRef } from 'react';
import { socket } from './socket'
import { useSelector } from 'react-redux';

export function Chat()  {

    const chatMessage = useSelector(
        state => state && state.chatMessages
    );

    const elemRef = useRef();

    useEffect(() => {
        console.log('chat looks mounted!');
        console.log('elemRef', elemRef);
        console.log("scroll top: ", elemRef.current.scrollTop);
        console.log('scrollheight: ', elemRef.current.scrollHeight);
        console.log('clientHeight: ', elemRef.current.clientHeight);
    }, []);

    const keyCheck = (e) => {
        // console.log("e.target.value:", e.target.value);
        // console.log("e.key", e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("Enter was pressed!");
            socket.emit("My amazing chat message", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <React.Fragment>
            <div className="chat-wrapper">
                <h1>Chat Room</h1>
                <div className="chat-container" ref={elemRef}>
                    <p>Chat messages will go here. I am a chat.</p>
                    <p>Chat messages will go here. I am a chat.</p>
                    <p>Chat messages will go here. I am a chat.</p>
                    <p>Chat messages will go here. I am a chat.</p>
                    <p>Chat messages will go here. I am a chat.</p>
                    <p>Chat messages will go here. I am a chat.</p>
                    <p>Chat messages will go here. I am a chat.</p>
                </div>
                <textarea placeholder = "Add your message here" onKeyDown = { keyCheck }></textarea>
            </div>
        </React.Fragment>
    );
}
