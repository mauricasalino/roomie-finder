import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        console.log(e.target.value);
        //take value of inpiut fields and attach it as a property of the component:
        this.setState({
            [e.target.name]: e.target.value
        });

    }
    async submit() {
        console.log('this.state.draftBio:', this.state.draftBio);
        console.log('this.state', this.state);
        try {
            const { data } = await axios.post("/bio", {
                draftBio: this.state.draftBio
            });
            console.log("data", data);
            this.props.setBio(data);
            this.setState({
                editing: false
            });
        } catch (err) {
            console.log("err in POST /bio", err);
        }
    }
    render() {
        return (
            <div>
                {this.props.bio && (
                    <div>
                        <p className="bio-text-container">{this.props.bio}</p>
                        <button className="myButton"
                            onClick={e =>
                                this.setState({
                                    editing: true
                                })
                            }
                        >
                            Edit bio
                        </button>
                    </div>
                )}

                {this.state.editing && (
                    <div>
                        <textarea
                            name="draftBio"
                            cols={20}
                            rows={5}
                            className="bio-text-container"
                            onChange={e => this.handleChange(e)}
                        />
                        <button className="myButton" onClick={e => this.submit()}>Save</button>
                    </div>
                )}
                {!this.props.bio && (
                    <button className="myButton"
                        onClick={e =>
                            this.setState({
                                editing: true
                            })
                        }
                    >
                        Add your bio
                    </button>
                )}
            </div>
        );
    }
}
