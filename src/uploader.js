import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleUploadClick = this.handleUploadClick.bind(this);
    }

    handleChange(e) {
        console.log(e.target.files[0]);
        this.setState({
            file: e.target.files[0]
        });
    }
    handleUploadClick(e) {
        e.preventDefault();
        // const userImage = e.target.files[0];
        // console.log(userImage);
        var formData = new FormData();
        formData.append("file", this.state.file);
        console.log('this.state.file: ', this.state.file);
        axios.post("/uploader", formData)
            .then(({ data }) => {
                console.log("post data", data);
                console.log("this.props", this.props);
                // this.props.done(data.imageurl);
                if (data.imageurl) {
                    this.props.done(data.imageurl);
                    this.props.onClick();
                }
            })
            .catch(err => {
                console.log("Error Message in POST: ", err);
            });
    }
    render() {
        console.log('render this.state: ', this.state);
        return (
            <div>
                <div className="uploader">
                    <p onClick={this.props.onClick}>X</p>
                    {this.state.error &&
                                        <div className="error">Oops!<br/>Something went wrong 🙄</div>}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => this.handleChange(e)}/>
                    <button className="myButton" onClick={e => this.handleUploadClick(e)}>Submit</button>
                </div>
            </div>
        );
    }
}
