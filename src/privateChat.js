import React, { useState, useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export function PrivateChat(props) {
    const message = useSelector(state => state && state.pm);
    const id = props.match.params.id;
    // console.log("receiver_id is:", id);
    console.log("message", message);

    const elemRef = useRef();

    useEffect(() => {
        // const id = props.match.params.id;
        // console.log("receiver_id is:", id);

        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, []);

    const keyCheck = e => {
        // console.log("e.target.value", e.target.value);
        if (e.key == "Enter" && e.target.value !== "") {
            e.preventDefault();

            socket.emit("private message", e.target.value, { receiver_id: id });
            e.target.value = "";
        }
    };

    return (
        <div className="chat">
            <h1>Private chat </h1>
            <div className="chat-container" ref={elemRef}>
                {message &&
                    message.map(msg => (
                        <div className="chat-box" key={msg.id}>
                            <h2 className="chat-name">
                                <img
                                    style={{ height: "200px", width: "200px", borderRadius: "10px" }}
                                    src={msg.imageurl}
                                    alt={`${msg.first} ${msg.last}`}
                                />
                                &nbsp;&nbsp;&nbsp;
                                {msg.first} {msg.last} said:
                            </h2>
                            <div className="message">
                                <p className="chat-message">{msg.message}</p>
                                <p className="post_time">{msg.created_at}</p>
                            </div>
                        </div>
                    ))}
            </div>
            <textarea
                className="chat-textarea"
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            />
        </div>
    );
}
