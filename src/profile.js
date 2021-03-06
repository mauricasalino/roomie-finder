import React from 'react';
import Uploader from './uploader';
import ProfilePic from './profilepic';
import BioEditor from "./bioEditor";
import { Route, BrowserRouter } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from "./axios";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.setBio = this.setBio.bind(this);
        this.state = {
            uploaderIsVisible: false,
            bio: ""
        };
    }

    async componentDidMount() {
        console.log("componentDidMount", this.props);
        try {
            const { data } = await axios.get("/user");
            console.log("data", data);
            this.setState(data);
        } catch (err) {
            console.log("err in GET /user", err);
        }
    }

    setBio(data) {
        this.setState({
            bio: data
        });
    }

    render() {
        console.log("this.state.props: ", this.props);
        if (!this.state.id) {
            return <div className="loading">Loading ...
                <img src="http://giphygifs.s3.amazonaws.com/media/EO9j0o6pHdYmk/giphy.gif" />
                <img src="http://giphygifs.s3.amazonaws.com/media/EO9j0o6pHdYmk/giphy.gif" />
            </div>;
        }
        return (
            <BrowserRouter>
                <div className="page-wrapper">
                    <div>
                        <h1 className="profile-welcome">
                            Hello {this.state.first} {this.state.last}!<br></br> Nice to see you.
                        </h1>
                    </div>
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
                        <BioEditor
                            id={this.state.id}
                            imageurl = {this.state.imageurl}
                            first = {this.state.first}
                            last = {this.state.last}
                            bio = {this.state.bio}
                            setBio = {this.setBio}
                            inputStyle={{ fontSize: '1.5rem' }}
                            onClick={() => this.setState({
                                uploaderIsVisible: true
                            })}/>
                    </div>
                </div>



            </BrowserRouter>
        );
    }
}
