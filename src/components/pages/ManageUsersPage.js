import React, { Component } from "react";
import UsersMockAPI from "../api/UsersAPI";
import { Form, Button } from "semantic-ui-react";
import Validator from "validator";
import InlineError from "../messages/InlineError";
import RegisterForm from "../forms/RegisterForm";
import { withRouter } from "react-router";

class ManageUsersPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allUsers: [],
      data: {},
      email: "",
      password: "",
      isAddHidden: true,
      isEditHidden: true,
      errors: {},
      success: "",
      ready: false
    };
  }

  componentDidMount() {
    UsersMockAPI.getAll().then(users => {
      this.setState({
        allUsers: users,
        ready: true
      });
    });
  }

  toggleHidden(status) {
    if (status === 1) {
      this.setState({
        isAddHidden: !this.state.isAddHidden,
        isEditHidden: true
      });
    }
  }

  validate = data => {
    const errors = {};
    if (!Validator.isEmail(data.email)) errors.email = "Invalid email";
    if (!data.password) errors.password = "Can't be blank";
    if (data.password !== data.re_password)
      errors.re_password = "Passwords don't match";
    return errors;
  };

  onChange = e =>
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });

  editUser(event) {
    this.setState({
      ready: false
    });

    const errors = this.validate(this.state.data);
    this.setState({ errors });

    if (Object.keys(errors).length === 0) {
      const { id, email, password } = this.state.data;

      UsersMockAPI.editUser(id, email, password)
        .then(successMessage => {
          this.setState({
            success: successMessage
          });

          UsersMockAPI.getAll().then(users => {
            this.setState({
              ready: true,
              allUsers: users
            });
          });
        })
        .catch(error => {
          this.setState({
            errors: {
              email: error
            }
          });
        });
    }
  }

  toggleAdmin(id, status) {
    this.setState({
      ready: false
    });

    UsersMockAPI.toggleAdmin(id, status).then(() => {
      UsersMockAPI.getAll().then(users => {
        this.setState({
          ready: true,
          allUsers: users
        });
      });
    });
  }

  deleteUser(id) {
    this.setState({
      ready: false
    });

    UsersMockAPI.delete(id).then(() => {
      UsersMockAPI.getAll().then(users => {
        window.location.reload();
      });
    });
  }

  editUserContainer(id) {
    const { errors } = this.state;
    let editUser = {};

    if (id) {
      editUser = UsersMockAPI.getUserByID(id);
      if (editUser.user) {
        this.setState({ data: editUser.user });
        this.setState({
          isEditHidden: !this.state.isEditHidden,
          isAddHidden: true
        });
      }
    }

    return (
      <div>
        <br />
        <div className="ui two column grid">
          <div className="one wide column" />
          <div className="column">
            <hr />
            <h3>Edit User</h3>
            <Form>
              <Form.Field>
                <input
                  type="hidden"
                  id="id"
                  name="id"
                  value={this.state.data.id}
                  onChange={this.onChange}
                />
              </Form.Field>

              <Form.Field error={!!errors.email}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="example@example.com"
                  value={this.state.data.email}
                  onChange={this.onChange}
                />
                {errors.email && <InlineError text={errors.email} />}
              </Form.Field>
              <Form.Field error={!!errors.password}>
                <label htmlFor="password">Password</label>
                <input
                  type="text"
                  id="password"
                  name="password"
                  placeholder="Make it secure"
                  value={this.state.data.password}
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
                  value={this.state.data.re_password}
                  onChange={this.onChange}
                />
                {errors.re_password && (
                  <InlineError text={errors.re_password} />
                )}
              </Form.Field>

              <Button onClick={() => this.editUser(this.state.data.id)}>
                Edit User
              </Button>
              {this.state.success && <InlineError text={this.state.success} />}
            </Form>
          </div>
        </div>
      </div>
    );
  }

  active(id, userLoggedID) {
    if (parseInt(id) === parseInt(userLoggedID)) {
      return {
        background: "coral"
      };
    }
  }

  render() {
    let loggedUser = UsersMockAPI.getLoggedUserInfo();

    if (!loggedUser.isAdmin) {
      return <div>Access denied!</div>;
    }

    return (
      <div className="users-wrapper">
        <div className="users-list">
          <br />
          <hr />
          <h3>Manage Users {!this.state.ready ? " - Loading ..." : ""} </h3>
          <div className="ui divided four column grid">
            <div className="row">
              <div className="one wide column">
                <b>
                  <i>User ID</i>
                </b>
              </div>
              <div className="three wide column">
                <b>
                  <i>User Email</i>
                </b>
              </div>
            </div>
            {this.state.allUsers.map(u => {
              return (
                <div
                  className="row"
                  style={this.active(u.id, loggedUser.userLoggedID)}
                  key={u.id}
                >
                  <div className="one wide column">{u.id}</div>
                  <div className="three wide column">{u.email} -</div>

                  <div className="four wide column">
                    <div className="ui buttons">
                      <button
                        className={
                          u.isAdmin ? "ui button" : "ui button positive"
                        }
                        onClick={() => this.toggleAdmin(u.id, false)}
                      >
                        Default User
                      </button>
                      <div className="or" />
                      <button
                        className={
                          u.isAdmin ? "ui button positive" : "ui button"
                        }
                        onClick={() => this.toggleAdmin(u.id, true)}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  <div className="two wide column">
                    <button
                      className="ui primary button"
                      onClick={() => this.editUserContainer(u.id)}
                    >
                      Edit
                    </button>
                  </div>

                  <div className="two column">
                    {parseInt(u.id) === parseInt(loggedUser.userLoggedID) ? (
                      "Currently Logged AS"
                    ) : (
                      <button
                        className="ui vertical animated button"
                        onClick={() => this.deleteUser(u.id)}
                      >
                        <div className="hidden content">Delete</div>
                        <div className="visible content">
                          <i aria-hidden="true" className="delete icon" />
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <br />
        <button className="ui button" onClick={() => this.toggleHidden(1)}>
          Toggle Add New User
        </button>

        {!this.state.isEditHidden ? this.editUserContainer() : ""}
        <div className="ui two column grid">
          <div className="one wide column" />
          <div className="column">
            {!this.state.isAddHidden ? (
              <div>
                <br />
                <hr />
                <h3>Add User</h3>
                <RegisterForm />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(ManageUsersPage);
