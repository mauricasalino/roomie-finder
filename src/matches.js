import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriends, endFriendship } from "./actions";
import { Link } from "react-router-dom";
import axios from "./axios";

export default function Matches() {
    const dispatch = useDispatch();
    const friends = useSelector(
        state =>
            state.users && state.users.filter(user => user.accepted == true)
    );
    const wannabes = useSelector(
        state =>
            state.users && state.users.filter(user => user.accepted == false)
    );
    // async componentDidMount => {
    //     try {
    //         const id = this.props.match.params.id;
    //         const { data } = await axios.get(`/user/api/${id}.json`);
    //         // console.log("data", data);
    //         if (data.sameUser) {
    //             this.props.history.push("/");
    //         } else if (data.noUser) {
    //             this.setState({
    //                 noUser: true
    //             });
    //         } else {
    //             this.setState({
    //                 first: data.first,
    //                 last: data.last,
    //                 bio: data.bio,
    //                 image: data.image
    //             });
    //         }
    //     } catch (err) {
    //         console.log("err in GET /user/id", err);
    //     }
    // };

    useEffect(() => {
        dispatch(receiveFriends());
    }, []);

    console.log("testing friends", friends);
    console.log("testing wannabes", wannabes);

    return (
        <div>
            <div className="friends">
                <h1>See your matches:</h1>
                {friends &&
                    friends.map(friends => {
                        return (
                            <div key={friends.id}>
                                <img
                                    className="profile-pic-img"
                                    width={500}
                                    height={500}
                                    src={friends.imageurl} />
                                <h3 className="bio-text-container">
                                    {friends.first} {friends.last}
                                </h3>
                                <button className="myButton"
                                    onClick={e =>
                                        dispatch(endFriendship(friends.id))
                                    }
                                >
                                    End Friendship
                                </button>
                                
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
