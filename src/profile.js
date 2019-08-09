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
        try {
            const { data } = await axios.get("/user");
            console.log("data", data);
            this.setState(data);
        } catch (err) {
            console.log("err in GET /user", err);
        }
    }

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
                    <div className = "header-right-wrapper">
                        {this.state.uploaderIsVisible && (
                            <Uploader
                                done={imageurl => {
                                    console.log('imageurl at Uploader: ', imageurl);
                                    this.setState({ imageurl });}}
                                onClick={() =>
                                    this.setState({
                                        uploaderIsVisible: false
                                    })}/>)}
                        <ProfilePic
                            id={this.state.id}
                            imageurl = {this.state.imageurl}
                            first = {this.state.first}
                            last = {this.state.last}
                            onClick={() => this.setState({
                                uploaderIsVisible: true
                            })}/>
                    </div>
                </div>
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
                <Route path="/findpeople" render={props => <FindPeople />} />
                <Route path="/friends" render={props => <Friends />} />
                <Route exact path="/chat" component={Chat} />
            </BrowserRouter>
        );
    }
}