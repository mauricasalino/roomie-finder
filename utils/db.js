var spicedPg = require('spiced-pg');
//const bc = require('./bc');

let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg('postgres:postgres:postgres@localhost:5432/socialnetwork');
}

exports.getUserInfo = function (id) {
    return db.query(`SELECT * FROM users WHERE id=$1`,
        [id]
    );
};

exports.newUser = function newUser(first, last, email, password) {
    return db.query(
        `INSERT INTO users (first, last, email, password, created_at)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *`,
        [first, last, email, password]
    );
};

exports.getPassword = function getPassword(email) {
    return db.query(`SELECT password, id FROM users WHERE users.email=$1`, [
        email
    ]);
};

exports.addBioToUser = function addBioToUser(id, bio) {
    console.log('id in addBioToUser db.js: ', id, bio);
    return db.query("UPDATE users SET bio = $2 WHERE id = $1 RETURNING *",
        [
            id,
            bio
        ]);
};

exports.addImageToUser = function addImageToUser(id, imageurl) {
    return db.query("UPDATE users SET imageurl = $2 WHERE users.id = $1 RETURNING *",
        [
            id,
            imageurl
        ]);
};


exports.getInfo = function getInfo(id) {
    return db.query(
        "SELECT first, last, imageurl, bio FROM users WHERE id = $1",
        [id]
    );
};

// exports.getUsersByName = function(str) {
//     return db.query(
//         `SELECT first, last, profile_pic FROM users WHERE first ILIKE $1;`,
//         [str + "%"]
//     );
// };

exports.getLastUsersList = function getLastUsersList() {
    return db.query(
        "SELECT id, first, last, imageurl FROM users ORDER BY id DESC LIMIT 3"
    );
};

exports.getUsersInSearch = function getUsersInSearch(val) {
    return db.query(
        `SELECT id, first, last, imageurl FROM users WHERE first ILIKE $1 ORDER by first ASC`,
        [val + "%"]
    );
};

exports.getFriendshipInfo = function getFriendshipInfo(sender_id, receiver_id) {
    return db.query(
        `SELECT * FROM friendships WHERE (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id = $1)`,
        [sender_id, receiver_id]
    );
};

exports.getFriendshipStatus = function getFriendshipStatus(
    sender_id,
    receiver_id
) {
    return db.query(
        "SELECT * FROM friendships WHERE (sender_id =$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1)",
        [sender_id, receiver_id]
    );
};

exports.insertFriendship = function insertFriendship(sender_id, receiver_id) {
    return db.query(
        "INSERT INTO friendships (sender_id, receiver_id) VALUES ($1, $2) RETURNING accepted",
        [sender_id, receiver_id]
    );
};

exports.confirmFriendship = function confirmFriendship(sender_id, receiver_id) {
    return db.query(
        "UPDATE friendships SET accepted = true WHERE sender_id = $1 AND receiver_id = $2",
        [sender_id, receiver_id]
    );
};
exports.deleteFriendship = function deleteFriendship(sender_id, receiver_id) {
    return db.query(
        "DELETE FROM friendships WHERE sender_id = $1 AND receiver_id = $2",
        [sender_id, receiver_id]
    );
};

exports.cancelRequest = function cancelRequest(sender_id, receiver_id) {
    return db.query(
        "DELETE FROM friendships WHERE sender_id = $1 AND receiver_id = $2",
        [sender_id, receiver_id]
    );
};

exports.getListOfUsers = function getListOfUsers(id) {
    return db.query(
        "SELECT users.id, first, last, bio, imageurl, accepted FROM friendships JOIN users ON (accepted = false AND receiver_id =$1 AND sender_id = users.id) OR (accepted = true AND receiver_id = $1 AND sender_id = users.id) OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)",
        [id]
    );
};

exports.acceptFriendship = function acceptFriendship(sender_id, receiver_id) {
    return db.query(
        "UPDATE friendships SET accepted = true WHERE sender_id = $1 AND receiver_id = $2",
        [sender_id, receiver_id]
    );
};

exports.addMessage = function(message, sender_id) {
    return db.query(
        "INSERT INTO chats (message, sender_id) VALUES ($1, $2) RETURNING *",
        [message, sender_id]
    );
};

exports.lastTenMessages = function() {
    return db.query(
        "SELECT chats.id, sender_id, chats.message, chats.created_at, users.first, users.last, users.imageurl FROM chats LEFT JOIN users ON users.id = chats.sender_id ORDER BY chats.id DESC LIMIT 10"
    );
};

exports.addPrivateMessage = function(message, sender, receiver) {
    return db.query(
        "INSERT INTO private (message, sender_id, receiver_id) VALUES ($1, $2, $3) RETURNING *",
        [message, sender, receiver]
    );
};

exports.getReceiver = function(id) {
    return db.query(
        "SELECT first AS receiver_first, last AS receiver_last, imageurl AS receiver_imageurl FROM users WHERE users.id=$1",
        [id]
    );
};
