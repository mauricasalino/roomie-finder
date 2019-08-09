import axios from "./axios";

export async function receiveFriends() {
    console.log("actions");
    const { data } = await axios.get("/friends.json");
    console.log("testing data action", data);
    return {
        type: "RECEIVE_FRIENDS",
        users: data.rows
    };
}

export function newChatMessage(msg) {
    console.log("data", msg);
    return {
        type: "NEW_CHAT_MESSAGE",
        msg
    };
}

export function chatMessages(msgs) {
    console.log("10 messages data", msgs);
    return {
        type: "CHAT_MESSAGES",
        msgs
    };
}

export async function acceptRequest(id) {
    const accept = await axios.post("/getbutton/accept/" + id);
    console.log("accept friend request worked", accept);
    return {
        type: "ACCEPT_REQUEST",
        id
    };
}

export async function cancelRequest(id) {
    const cancel = await axios.post("/getbutton/cancel/" + id);
    console.log("accept friend request worked", cancel);
    return {
        type: "CANCEL_REQUEST",
        id
    };
}

export async function endFriendship(id) {
    const deleted = await axios.post("getbutton/delete/" + id);
    console.log("delete friend request worked", deleted);
    return {
        type: "END_FRIENDSHIP",
        id
    };
}

export function newPrivateMessage(data) {
    console.log("new private message:", data);
    return {
        type: "NEW_PRIVATE_MESSAGE",
        pm: data
    };
}

export function newWallPost (data) {
    console.log("newWallPost", data);
    return {
        type: "NEW_WALL_POST",
        post: data
    };
}

export function oldWallPost (data) {
    console.log("oldWallPost", data);
    return {
        type: "OLD_WALL_POST",
        post: data
    };
}
