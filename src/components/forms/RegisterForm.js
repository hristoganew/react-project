import React from "react";
import { Form, Button } from "semantic-ui-react";
import Validator from "validator";
import InlineError from "../messages/InlineError";
import UsersAPI from "../api/UsersAPI";
import { withRouter } from "react-router";

class RegisterForm extends React.Component {
  state = {
    data: {
      email: "",
      password: "",
      re_password: ""
    },
    loading: false,
    errors: {}
  };

  onChange = e =>
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });

  onSubmit = () => {
    const errors = this.validate(this.state.data);
    this.setState({ errors });

    if (Object.keys(errors).length === 0) {
      const { email, password } = this.state.data;

      UsersAPI.register(email, password)
        .then(() => {
          this.props.history.push("/");

          window.location.reload();
        })
        .catch(error => {
          this.setState({
            errors: {
              email: error
            }
          });
        });
    }
  };

  validate = data => {
    const errors = {};
    if (!Validator.isEmail(data.email)) errors.email = "Invalid email";
    if (!data.password) errors.password = "Can't be blank";
    if (data.password !== data.re_password)
      errors.re_password = "Passwords don't match";
    return errors;
  };

  render() {
    const { data, errors } = this.state;

    return (
      <Form onSubmit={this.onSubmit.bind(this)}>
        <Form.Field error={!!errors.email}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@example.com"
            value={data.email}
            onChange={this.onChange}
          />
          {errors.email && <InlineError text={errors.email} />}
        </Form.Field>
        <Form.Field error={!!errors.password}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Make it secure"
            value={data.password}
            onChange={this.onChange}
          />
          {errors.password && <InlineError text={errors.password} />}
        </Form.Field>

        <Form.Field error={!!errors.re_password}>
          <label htmlFor="password">Repeat Password</label>
          <input
            type="password"
            id="re_password"
            name="re_password"
            placeholder="Make it secure"
            value={data.re_password}
            onChange={this.onChange}
          />
          {errors.re_password && <InlineError text={errors.re_password} />}
        </Form.Field>

        <Button primary>Register User</Button>
      </Form>
    );
  }
}

export default withRouter(RegisterForm);
