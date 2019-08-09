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

            {firstRender && <h3 className="lastjoined">Check out who just joined!</h3>}

            <div>
                {users &&
                    users.map(users => {
                        return (
                            <div
                                key={users.id}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "5rem 1fr"
                                }}
                            >
                                <Link to={`/user/${users.id}`}>
                                    <img
                                        style={{
                                            gridColumn: 1 / 2,
                                            height: 5 + "rem",
                                            width: 3.8 + "rem"
                                        }}
                                        src={users.imageurl}
                                        alt={`${users.first} ${users.last}`}
                                    />
                                </Link>
                                <h3 style={{ gridColumn: 2 / 3 }}>
                                    {users.first} {users.last}
                                </h3>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
