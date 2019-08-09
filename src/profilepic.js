import React from "react";


export default function({ imageurl, first, last, onClick }) {
    imageurl = imageurl || "defaultuser.png";
    return <img
        src={imageurl}
        alt={`${first} ${last}`}
        width={160}
        onClick={onClick} />;
}
