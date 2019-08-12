import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriends, cancelRequest, acceptRequest } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        state =>
            state.users && state.users.filter(user => user.accepted == true || user.cancelled != false)
    );
    const wannabes = useSelector(
        state =>
            state.users && state.users.filter(user => user.accepted == false && user.cancelled != true)
    );

    useEffect(() => {
        dispatch(receiveFriends());
    }, []);

    console.log("testing friends", friends);
    console.log("testing wannabes", wannabes);

    return (
        <div>
            <div
                className="tinder"
                style={{ borderBottom: "solid 2px black" }}
            >
                <h1>Check who wants to be your roomie! 😜😜😜</h1>
                {wannabes &&
                    wannabes.map(wannabes => {
                        return (
                            <div className="tinder--cards" key={wannabes.id}>
                                <div className="tinder--card" style={{
                                    backgroundImage: "url(" + wannabes.imageurl + ")",
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat'
                                }}>
                                    <h3>
                                        {wannabes.first} {wannabes.last}
                                    </h3>
                                    <p className="bio-matches">
                                        {wannabes.bio}
                                    </p>

                                </div>

                                <div>
                                    <button
                                        onClick={e =>
                                            dispatch(cancelRequest(wannabes.id))
                                        }
                                    >
                                        <img src="nope.png" />
                                    </button>
                                    <button
                                        onClick={e =>
                                            dispatch(acceptRequest(wannabes.id))
                                        }
                                    >
                                        <img src="yes.png" />
                                    </button>
                                </div>

                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
