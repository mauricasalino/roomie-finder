import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriends, endFriendship } from "./actions";

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
