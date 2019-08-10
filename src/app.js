import React from 'react';
import Uploader from './uploader';
import Profile from './profile';
import ProfilePic from './profilepic';
import BioEditor from "./bioEditor";
import OtherProfile from "./otherprofile";
import { Route, BrowserRouter } from "react-router-dom";
import FindPeople from "./findpeople";
import Friends from "./friends";
import { Link } from 'react-router-dom';
import axios from "./axios";
import { Chat } from './chat';
import { PrivateChat } from "./privateChat";
import Matches from "./matches";
import Usermenu from "./usermenu";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
            bio: ""
        };
    }

    async componentDidMount() {
        console.log("componentDidMount");
        // const script = document.createElement("script");
        // script.src = "/scriptswipecards.js";
        // script.async = true;
        // script.onload = () => this.scriptLoaded();

        // document.body.appendChild(script);
        try {
            const { data } = await axios.get("/user");
            console.log("data", data);
            this.setState(data);
        } catch (err) {
            console.log("err in GET /user", err);
        }
    }
    // scriptLoaded() {
    //     window.A.sort();
    // }

    render() {
        console.log("this.state: ", this.state);
        if (!this.state.id) {
            return <div className="loading">Loading ...
                <img src="http://giphygifs.s3.amazonaws.com/media/EO9j0o6pHdYmk/giphy.gif" />
                <img src="http://giphygifs.s3.amazonaws.com/media/EO9j0o6pHdYmk/giphy.gif" />
            </div>;
        }
        return (
            <BrowserRouter>
                <div className="page-wrapper">
                    <div className = "header-wrapper">
                        <p><Link to="/profile"><img src="profilelogo.png" /></Link></p>
                        <p><Link to="/friends"><img src="logo.jpg" /></Link></p>
                        <p><Link to="/matches"><img src="chat.png" /></Link></p>
                    </div>
                    <div className="profile-wrapper">
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    bio={this.state.bio}
                                    bioEditor={
                                        <BioEditor
                                            bio={this.state.bio}
                                            setBio={data => this.setState({ bio: data })}
                                        />}
                                    profilePic={
                                        <ProfilePic
                                            first={this.state.first}
                                            last={this.state.last}
                                            imageurl={this.state.imageurl}
                                            onClick={() => {this.setState({
                                                uploaderIsVisible: true});
                                            }}
                                        />
                                    }
                                />
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherProfile
                                    key={props.match.imageurl}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route
                            path="/chat/:id"
                            render={props => (
                                <PrivateChat
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/profile" render={props => <Profile />} />
                        <Route path="/friends" render={props => <Friends />} />
                        <Route exact path="/matches" component={Matches} />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
