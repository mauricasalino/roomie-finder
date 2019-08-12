import React from 'react';
import axios from './axios';
//import { HashRouter, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default class Registration extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
        //this[e.target.name] = e.target.value;
        console.log(e.target.value);
    }
    submit(e) {
        e.preventDefault();
        console.log('this: ', this);
        axios.post('/registration', {
            first: this.state.first,
            last: this.state.last,
            email: this.state.email,
            password: this.state.password
        }).then(
            ({data}) => {
                if (data.success) {
                    console.log('new user registered!');
                    location.replace('/');
                } else {
                    this.setState({
                        error: true
                    });
                }
                console.log("data", data.success);
            })
            .catch(function(err) {
                console.log("err in POST /welcome", err);
            });
    }
    render() {
        return ( <
            div>
            <
                div className = "wrapper" >
                <img src="./logo.JPG" className="logo-welcome" />

                <
                    div className = "form-wrapper" >
                    <
                        h1 className="h1-registration"> Create<br/>your<br/> Account<br/>
                            to find<br/> your next roomie<br></br><br></br>
                    < /h1>

                    <
                        form > <div>First Name: <
                            input type = 'text'
                            name = 'first'
                            className='firstName'
                            onChange = {
                                e => this.handleChange(e)
                            }
                        /></div><div>Last Name: <
                            input type = 'text'
                            name = 'last'
                            className='lastName'
                            onChange = {
                                e => this.handleChange(e)
                            }
                        /></div><div>E-Mail: <
                            input type = 'text'
                            name = 'email'
                            className='email'
                            onChange = {
                                e => this.handleChange(e)
                            }
                        /></div><div>Password: <
                            input type = 'password'
                            name = 'password'
                            className='password'
                            onChange = {
                                e => this.handleChange(e)
                            }
                        /></div> <
                            button className="myButton" onClick = {
                                e => this.submit(e)
                            } > REGISTER < /button> < /
                        form >
                </div>
                {this.state.error &&
                            <div className="error">Oops!<br/>Something went wrong 🙄</div>}
                <div className="welcome-already-member">
                Already a member?
                    <Link to="/login"> Log In!</Link>
                </div>
            < /div >
        < /div>
        ); // closes return
    }
}
