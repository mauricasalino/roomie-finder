import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export function Chat() {
    const chatMessages = useSelector(state => state && state.chatMessages);
    console.log("chatMessages are: ", chatMessages);
    const elemRef = useRef();
    useEffect(() => {
        // console.log("chat hooks mounted!");
        // console.log("elemRef", elemRef);
        // console.log("scroll top: ", elemRef.current.scrollTop);
        // console.log("scroll heightL ", elemRef.current.scrollHeight);
        // console.log("clientHeight: ", elemRef.current.clientHeight);
        elemRef.current.scrollTop =
         elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, []);
    const keyCheck = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("enter was pressed", e.target.value);
            socket.emit("newChatMessage", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div className="big-chat-container">
            <h1>GENERAL Chat Room</h1>
            <div
                className="chat-container"
                ref={elemRef}>
                {chatMessages &&
                    chatMessages.map(chatMessages => {
                        return (
                            <div className="chat-message" key={chatMessages.id}>
                                <img
                                    style={{ height: "50px", width: "50px", borderRadius: "10px" }}
                                    src={chatMessages.imageurl}
                                />
                                <p>
                                    {chatMessages.first} {chatMessages.last} said:&nbsp;
                                </p>
                                <p> {chatMessages.message}&nbsp;</p>
                                <p>&nbsp;{chatMessages.created_at}</p>
                            </div>
                        );
                    })}
            </div>
            <textarea
                onKeyDown={keyCheck}
                className="enter-textarea"
                placeholder="Add your message here"
            />
        </div>
    );
}
