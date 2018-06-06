import React from "react";
import RegisterForm from "../forms/RegisterForm";
import PageHeader from "./PageHeader";

class SignUpPage extends React.Component {
  submit = data => {
    console.log(data);
  };

  render() {
    return (
      <div>
        <PageHeader />

        <RegisterForm submit={this.submit} />
      </div>
    );
  }
}

export default SignUpPage;