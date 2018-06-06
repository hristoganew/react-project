import React from "react";
import LoginForm from "../forms/LoginForm";
import { Link } from "react-router-dom";
import PageHeader from "./PageHeader";
class LoginPage extends React.Component {
  submit = data => {
    console.log(data);
  };

  render() {
    return (
      <div>
        <PageHeader />
        <LoginForm submit={this.submit} />

        <p>Don't have an account?</p>
        <Link to="/signup">Sign up here!</Link>
      </div>
    );
  }
}

export default LoginPage;
