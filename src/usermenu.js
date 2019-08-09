import React from 'react';
import Uploader from './uploader';
import { Link } from 'react-router-dom';
import ProfilePic from './profilepic';
import axios from "./axios";

export default class Usermenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        console.log(e.target.value);
        //take value of inpiut fields and attach it as a property of the component:
        this.setState({
            [e.target.name]: e.target.value
        });

    }
    async submit() {
        console.log('this.state.draftBio:', this.state.draftBio);
        console.log('this.state', this.state);
        try {
            const { data } = await axios.post("/bio", {
                draftBio: this.state.draftBio
            });
            console.log("data", data);
            this.props.setBio(data);
            this.setState({
                editing: false
            });
        } catch (err) {
            console.log("err in POST /bio", err);
        }
    }
    render() {
        return (
            <div className = "profile-wrapper">
                <img src="./logo.JPG" className="logo-welcome" />
                <div className="navmenu">
                    <ul>
                        <li><Link to="/FindPeople">Find a Roomie</Link></li>
                        <li><Link to="/profile">Edit your Profile</Link></li>
                        <li><Link to="/friends">FIND Matches</Link></li>
                        <li><Link to="/matches">SEE Matches</Link></li>
                        <li><Link to="/chat">General Chat</Link></li>
                        <li><a href="/logout">Log Out</a></li>
                    </ul>
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
                </div>
                <div className="profile-bio">
                    {this.props.bio && (
                        <div>
                            <p>{this.props.bio}</p>
                            <button className="myButton"
                                onClick={e =>
                                    this.setState({
                                        editing: true
                                    })
                                }
                            >
                                Edit bio
                            </button>
                        </div>
                    )}

                    {this.state.editing && (
                        <div>
                            <textarea
                                name="draftBio"
                                onChange={e => this.handleChange(e)}
                            />
                            <button className="myButton" onClick={e => this.submit()}>Save</button>
                        </div>
                    )}
                    {!this.props.bio && (
                        <button className="myButton"
                            onClick={e =>
                                this.setState({
                                    editing: true
                                })
                            }
                        >
                            Add your bio
                        </button>
                    )}
                </div>
            </div>
        );
    }
}
