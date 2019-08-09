const express = require('express');
const app = express();
const compression = require('compression');
const db = require('./utils/db');
const bc = require('./utils/bc');
const cookieSession = require('cookie-session');
const csurf = require("csurf");
const bodyParser = require("body-parser");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const {s3Url} = require("./config");
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' } );
const moment = require('moment');


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

const usersConnectedNow = [];

io.on("connection", async socket => {
    console.log(`A socket with the id ${socket.id} just connected.`);

    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    //here we're grabbing their userId
    let userId = socket.request.session.userId;

    const newUserConnected = {
        userid: userId,
        [userId]: socket.id
    };

    usersConnectedNow.push(newUserConnected);

    console.log("connected users:", usersConnectedNow);

    db.lastTenMessages().then(data => {
        data.rows.forEach(i => {
            i.created_at = moment(i.created_at, moment.ISO_8601).fromNow();
        });
        socket.emit("chatMessages", data.rows.reverse());
        io.emit("chatMessages", data.rows);
    });
    // console.log("last 10 messages", result.rows);


    // part 2 is dealing with a new chat message

    socket.on("newChatMessage", async msg => {
        console.log(`message is: ${msg} from ${userId}`);
        const message = await db.addMessage(msg, userId);
        const user = await db.getUserInfo(userId);
        // console.log(message.rows[0]);
        // console.log("user", user.rows[0]);
        message.rows[0].created_at = moment(
            message.rows[0].created_at,
            moment.ISO_8601
        ).fromNow();
        const result = { ...message.rows[0], ...user.rows[0] };
        console.log("result", result);

        io.sockets.emit("newChatMessage", result);
    });

    //--------------------- private messages -------------------------

    socket.on("private message", async (msg, id) => {
        console.log(
            `private message to ${id.receiver_id} from ${userId} is: ${msg}`
        );

        const privateMessage = await db.addPrivateMessage(
            msg,
            userId,
            id.receiver_id
        );
        const sender = await db.getUserInfo(userId);

        const dataForPm = { ...privateMessage.rows[0], ...sender.rows[0] };

        const newUserConnected = {
            userid: userId,
            [userId]: socket.id
        };

        let receiverId = usersConnectedNow.filter(
            i => i.userid == id.receiver_id
        );

        let senderId = usersConnectedNow.filter(i => i.userid == userId);

        console.log("data for pm", dataForPm);

        receiverId.forEach(i =>
            io.to(i[id.receiver_id]).emit("newPrivateMessage", dataForPm)
        );

        senderId.forEach(i =>
            io.to(i[userId]).emit("newPrivateMessage", dataForPm)
        );
    });

    // ----------------------------------wall---------------------------------------

    socket.on('wallpost', async (val, id) => {
        console.log(`post from ${userId} to ${id.receiver_id}: ${val}`);

        let newPost = await db.addWallPost(userId, id.receiver_id, val);
        console.log("newPost.rows", newPost.rows);
        io.emit('newWallPost', newPost);

        console.log("id.receiver_id", id.receiver_id);

        let getWallPost = await db.getWallPost(id.receiver_id);
        console.log("getWallPost", getWallPost.rows);

        io.emit('oldWallPost', getWallPost.rows);

        getWallPost.rows.forEach(wallpost => {
            wallpost.created_at = moment(wallpost.created_at, moment.ISO_8601).fromNow();
        });
    });


    // ----------------------------------wall---------------------------------------

    socket.on("disconnect", () => {
        console.log(`A socket with the id ${socket.id} just disconnected.`);
        // const socketDisconnected = socket.id;
        // console.log("socketToRemove:", socketDisconnected);
        // usersConnectedNow = usersConnectedNow.filter(
        //     i => i[userId] !== socketDisconnected
        // );

        // console.log("new users that are connected", usersConnectedNow);
    });
});

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
//this is an object, which has a method on it called single.
var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(compression());

app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(express.static(__dirname + '/public'));

app.use(express.static(__dirname + '/src'));


app.get('/welcome', function(req, res) {
    if (req.session.userId) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});



app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
    // res.sendFile(__dirname + '/index.html');
    // res.json({
    //     loggedout: true
    // });
});

app.get("/last-users", async (req, res) => {
    let resp = await db.getLastUsers();
    res.json({ result: resp.rows });
});

app.get("/user", async (req, res) => {
    try {
        const result = await db.getUserInfo(req.session.userId);
        console.log("userId: ", result);
        res.json(result.rows[0]);
    } catch (err) {
        console.log("err in GET /user", err);
    }
});

app.get("/user/api/:id", async (req, res) => {
    console.log('req.params.id: ', req.params.id);
    const { rows } = await db.getUserInfo(req.params.id);
    console.log(rows);
    let user = rows[0];
    if (!user.imageurl) {
        user.imageurl =
            "defaultuser.png";
    }
    if (!user.bio) {
        user.bio = "No bio for this user";
    }
    res.json(user);
});

app.get("/users.json", async function(req, res) {
    try {
        const userList = await db.getLastUsersList();
        console.log(userList);
        res.json(userList.rows);
    } catch (err) {
        console.log("err in get find people", err);
    }
});

app.get("/friends.json", function(req, res) {
    try {
        db.getListOfUsers(req.session.userId).then(list => {
            res.json(list);
        });
    } catch (err) {
        console.log("err in get friendsList", err);
    }
});

app.post("/getbutton/add/:id", async function(req, res) {
    try {
        const addFriendship = await db.addFriendship(
            req.session.userId,
            req.params.id
        );
        res.json(addFriendship.rows);
    } catch (err) {
        console.log("err in post add getbutton", err);
    }
});

app.post("/getbutton/delete/:id", async function(req, res) {
    try {
        const deleteFriendship = await db.deleteFriendship(
            req.params.id,
            req.session.userId
        );
        res.json({ success: true });
    } catch (err) {
        console.log("err in post delete getbutton", err);
    }
});

app.post("/getbutton/accept/:id", async function(req, res) {
    try {
        const accept = await db.acceptFriendship(
            req.params.id,
            req.session.userId
        );
        res.json({ success: true });
    } catch (err) {
        console.log("err in post accept getbutton", err);
    }
});

app.post("/getbutton/cancel/:id", async function(req, res) {
    try {
        const cancel = await db.cancelRequest(
            req.params.id,
            req.session.userId
        );
        res.json({ success: true });
    } catch (err) {
        console.log("err in post cancel getbutton", err);
    }
});

// app.get("/find-users/:str/json", async (req, res) => {
//     let result = await db.getUsersByName(req.params.str);
//     res.json({ data: result.rows });
// });

app.get("/users/2/:val.json", async function(req, res) {
    try {
        console.log("testing req.val", req.params);
        const searchUser = await db.getUsersInSearch(req.params.val);
        console.log("testing search user", searchUser.rows);
        res.json(searchUser.rows);
    } catch (err) {
        console.log("err in get query find people", err);
    }
});

app.get('/friendshipStatus/:id', (req,res)=>{
    console.log('get friendshipStatus req.params.id', req.params.id);
    console.log('get friendshipStatus req.session.userId', req.params.id);
    db.getFriendshipStatus(req.params.id, req.session.userId).then(({rows})=>{
        if(rows.length==0){
            res.json({buttonMode:"Add Friend"});
        } else if (rows[0].sender_id==req.params.id && !rows[0].accepted){
            res.json({buttonMode:"Accept Friendship Request"});
        } else if (rows[0].sender_id==req.session.userId && !rows[0].accepted){
            res.json({buttonMode:"Cancel Friendship Request"});
        }  else {
            res.json({buttonMode:"End Friendship"});
        }
    }).catch(err=>{
        console.log("error in GET /friendshipStatus: ",err.message);
    });
});

app.post("/bio", async (req, res) => {
    console.log('req.session: ', req.session);
    console.log('req.body: ', req.body);
    try {
        const result = await db.addBioToUser(req.session.userId, req.body.draftBio);
        console.log('bio result: ', result);
        res.json(result.rows[0].bio);
    } catch (err) {
        console.log("err in POST /bio", err);
    }
});


app.post("/uploader", uploader.single("file"), s3.upload, async (req, res) => {
    const imageurl = s3Url + req.file.filename;
    console.log('req.file.filename: ', req.file.filename);
    // console.log(req.session);
    const id = req.session.userId;
    console.log("upload url: ", imageurl);
    db
        .addImageToUser(id, imageurl)
        .then(result => {
            console.log(
                "Result of trying to store imageurl in users table:",
                result
            );
            return res.json({ success: true, imageurl: imageurl });
        })
        .catch(err => {
            console.log("Error in /upload route: ", err.message);
            return res.json({ success: false });
        });
});

app.post("/login", async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    try {
        let michael = await db.getPassword(email);
        if (michael.rows.length == 0) {
            throw new Error("email is not registered");
        }
        console.log('password of user is: ', michael.rows[0].password);
        let passwordOk = await bc.checkPassword(
            password,
            michael.rows[0].password
        );
        // console.log("didMatch", didMatch);
        req.session.userId = michael.rows[0].id;
        res.json({ passwordOk });
        // let hash = await db.logIn(email);
        // let hash = await bc.checkPassword(password);
    } catch (err) {
        console.log('err in POST /login: ', err);
        res.json({ passwordOk: false });
    }
});

app.post("/registration", async (req, res) => {
    console.log(req.body);
    const { first, last, email, password } = req.body;
    try {
        let hash = await bc.hashPassword(password);
        let result = await db.newUser(first, last, email, hash);
        req.session.userId = result.rows[0].id;
        res.json ({success: true});
    } catch (err) {
        console.log('err in POST /registration: ', err);
    }
});

app.post('/friendshipStatus', (req,res)=>{
    if (req.body.buttonMode=="Send Friendship Request"){
        db.insertFriendship(req.session.userId,req.body.id).then(()=>{
            res.json({buttonMode:"Cancel Friendship Request"});
        }).catch(err=>{console.log("Error in POST /friendshipStatus insertFriendship function: ",err.message);}
        );
    } else if (req.body.buttonMode=="Accept Friendship Request"){
        db.confirmFriendship(req.session.userId).then(()=>{
            res.json({buttonMode:"End Friendship"});
        }).catch(err=>{console.log("Error in POST /friendshipStatus confirmFriendship function: ",err.message);});
    } else if (req.body.buttonMode=="Cancel Friendship Request"){
        db.cancelFriendshipRequest(req.session.userId).then(()=>{
            res.json({buttonMode:"Send Friendship Request"});
        }).catch(err=>console.log("Error in POST /friendshipStatus cancelFriendshipRequest function: ",err.message));
    } else {
        db.deleteFriendship(req.session.userId,req.body.id).then(()=>{
            res.json({buttonMode:"Send Friendship Request"});
        }).catch(err=>console.log("Error in POST /friendshipStatus deleteFriendship function: ",err.message));
    }
});

//DO NOT DELETE THIS
app.get('*', function(req, res) {
    if (!req.session.userId) {
        res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});
//DO NOT DELETE THIS

server.listen(process.env.PORT || 8080, function() {
    console.log("Final Project up and running!");
});
