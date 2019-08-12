import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default function FindPeople() {
    const [users, setUsers] = useState();
    const [firstRender, setFirstRender] = useState(true);
    const [val, setVal] = useState();
    useEffect(
        () => {
            if (!val) {
                (async () => {
                    const userList = await axios.get("/users.json");
                    setUsers(userList.data);
                    setFirstRender(true);
                })();
            } else {
                (async () => {
                    const searchUser = await axios.get(
                        "/users/2/" + val + ".json"
                    );
                    setUsers(searchUser.data);
                    setFirstRender(false);
                })();
            }
        },
        [val]
    );
    return (
        <div>
            <h1>FIND YOUR NEXT ROOMIE HERE: <input onChange={e => setVal(e.target.value)} /></h1>

            {firstRender && <h3 className="lastjoined">Check out the New Joiners!</h3>}

            <div>
                {users &&
                    users.map(users => {
                        return (
                            <div key={users.id}>
                                <Link to={`/user/${users.id}`}>
                                    <img
                                        className="profile-pic-img"
                                        width={500}
                                        height={500}
                                        src={users.imageurl}
                                        alt={`${users.first} ${users.last}`}/>
                                </Link>
                                <h3 className="bio-text-container">
                                    {users.first} {users.last}
                                </h3>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
