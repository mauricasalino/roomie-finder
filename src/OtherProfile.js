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
                    width={160}
                    height={200}
                    alt={`${this.state.first} ${this.props.last}`}
                />
                <FriendButton id={this.props.match.params.id} />
                <Link
                    className="myButton"
                    to={`/chat/${this.props.match.params.id}`}
                >
                                Chat
                </Link>
                <h4>
                    {this.state.first} {this.state.last}
                </h4>
                <p>{this.state.bio}</p>
                <Wall OtherId = {this.props.match.params.id}/>
            </div>
        );
    }
}
