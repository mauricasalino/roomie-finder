import React from "react";


export default function({ imageurl, first, last, onClick }) {
    imageurl = imageurl || "defaultuser.png";
    return <img
        className="profile-pic-img"
        src={imageurl}
        alt={`${first} ${last}`}
        width={700}
        height={700}
        onClick={onClick} />;
}
