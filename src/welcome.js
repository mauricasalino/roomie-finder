import React from 'react';
import Registration from './registration';
import Login from './login';
import { HashRouter, Route } from 'react-router-dom';

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <HashRouter>
                <div id="wrapper">
                    <div>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                    </div>
                </div>
            </HashRouter>
        );
    }
}
