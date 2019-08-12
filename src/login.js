import React from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';

export default class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        //this.submit = this.submit.bind(this);
    }
    handleChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    submit(e) {
        e.preventDefault();
        axios.post('/login', {
            email: this.state.email,
            password: this.state.password
        }).then(
            ({data}) => {
                console.log('data from server response', data);
                if (data.passwordOk == true) {
                    console.log('login sucessful!');
                    location.replace('/');
                } else {
                    this.setState({
                        error: true
                        //error message appear
                    });
                }
            }
        );
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
                        h1 > Log in<br/>
                            to find<br/> your next roomie<br></br><br></br>
                    < /h1>

                    <
                        form > <div>E-Mail: <
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
                            } > LOG IN < /button> < /
                        form >
                </div>
                {this.state.error &&
                            <div className="error">Oops!<br/>Something went wrong 🙄</div>}
                <div className="welcome-already-member">
                            Do not have an account?
                    <Link to="/registration"> Register
                    </Link></div>
            < / div >
        < /div>
        ); // closes return
    }
}
