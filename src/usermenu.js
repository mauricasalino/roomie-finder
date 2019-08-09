import React from 'react';
import Uploader from './uploader';
import { Link } from 'react-router-dom';
import ProfilePic from './profilepic';

export default function Usermenu () {
    return (
        <div className = "profile-page-wrapper">
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
        </div>
    );
}
