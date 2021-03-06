import React from "react";
import axios from "./axios";
import FriendButton from "./FriendButton";
import { Link } from "react-router-dom";
import Wall from "./wall";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const { id } = this.props.match.params;
        const { data } = await axios.get(`/user/api/${id}`);
        if (data.sameUser) {
            this.props.history.push("/");
        } else {
            this.setState(data);
        }
    }

    render() {
        return (
            <div className="profile-description">
                <img
                    src={this.state.imageurl}
                    className="profile-pic-img"
                    width={500}
                    height={500}
                    alt={`${this.state.first} ${this.props.last}`}
                /><br></br><br></br>
                <FriendButton id={this.props.match.params.id} />
                <Link
                    className="myButton"
                    to={`/chat/${this.props.match.params.id}`}
                >
                                Send Private Message
                </Link>
                <h4 className="bio-title">
                    {this.state.first} {this.state.last}
                </h4>
                <p className="bio-text">{this.state.bio}</p>
            </div>
        );
    }
}
