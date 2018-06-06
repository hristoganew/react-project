import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import UsersAPI from './components/api/UsersAPI';
import MainPage from './components/pages/MainPage';
import SignUpPage from './components/pages/SignUpPage';

export default class App extends Component {
    render() {
        UsersAPI.seedAdmin();
        return (
            <div className="ui container">
                <Switch>
                    <Route path="/" exact component={HomePage} />
                    <Route path="/login" exact component={LoginPage} />
                    <Route path="/main-page" exact component={MainPage} />
                    <Route path="/signup" exact component={SignUpPage} />
                </Switch>
            </div>
        );
    }
}


render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
    , document.getElementById('root'));
