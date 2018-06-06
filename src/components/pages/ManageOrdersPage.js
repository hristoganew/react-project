import React, { Component } from "react";
import OrdersAPI from "../api/OrdersAPI";
import UsersAPI from "../api/UsersAPI";
import { Form, Button } from "semantic-ui-react";
import InlineError from "../messages/InlineError";
import AddOrderForm from "../forms/AddOrderForm";
import { withRouter } from "react-router";

class ManageOrdersPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allOrders: [],
      data: {},
      title: "",
      description: "",
      score: "",
      isAddOrderHidden: true,
      isEditOrderHidden: true,
      errors: "",
      success: "",
      ready: false
    };
  }

  componentDidMount() {
    OrdersAPI.getAll().then(orders => {
      this.setState({
        allOrders: orders,
        ready: true
      });
    });
  }

  toggleHidden(status) {
    if (status === 1) {
      this.setState({
        isAddOrderHidden: !this.state.isAddOrderHidden,
        isEditOrderHidden: true
      });
    }
  }

  onChange = e =>
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });

  editUser(event) {
    this.setState({
      ready: false
    });

    const { id, title, description, score } = this.state.data;

    OrdersAPI.editOrder(id, title, description, score)
      .then(successMessage => {
        this.setState({
          success: successMessage
        });

        OrdersAPI.getAll().then(orders => {
          this.setState({
            ready: true,
            allOrders: orders
          });
        });
      })
      .catch(error => {
        this.setState({
          errors: error
        });
      });
  }

  toggleStatus(id, status) {
    this.setState({
      ready: false
    });

    OrdersAPI.toggleStatus(id, status).then(() => {
      OrdersAPI.getAll().then(orders => {
        this.setState({
          ready: true,
          allOrders: orders
        });
      });
    });
  }

  deleteOrder(id) {
    this.setState({
      ready: false
    });

    OrdersAPI.delete(id).then(() => {
      OrdersAPI.getAll().then(orders => {
        this.setState({
          ready: true,
          allOrders: orders
        });
      });
    });
  }

  editOrderContainer(id) {
    const { data, errors } = this.state;
    let editOrder = {};

    if (id) {
      editOrder = OrdersAPI.getOrder(id);
      if (editOrder.order) {
        this.setState({ data: editOrder.order });
        this.setState({
          isEditOrderHidden: !this.state.isEditOrderHidden,
          isAddOrderHidden: true
        });
      }
    }

    return (
      <div className="holder">
        <br />
        <div className="ui two column grid">
          <div className="one wide column" />
          <div className="column">
            <hr />
            <h3>Edit Order</h3>
            <Form onSubmit={this.editUser.bind(this)}>
              {errors && <InlineError text={errors} />}
              <Form.Field>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Bake a cake"
                  value={data.title}
                  onChange={this.onChange}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="description">Description</label>
                <input
                  type="textarea"
                  id="description"
                  name="description"
                  placeholder="Please explain"
                  value={data.description}
                  onChange={this.onChange}
                />
              </Form.Field>

              <Form.Field>
                <label htmlFor="score">Score</label>
                <input
                  type="number"
                  id="score"
                  name="score"
                  placeholder="Choose a number"
                  value={data.score}
                  onChange={this.onChange}
                />
              </Form.Field>

              <Button primary>Edit Order</Button>
              <hr />
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
    let loggedUser = UsersAPI.getLoggedUserInfo();

    if (!loggedUser.isAdmin) {
      return <div>Access denied!</div>;
    }

    return (
      <div className="users-wrapper">
        <div className="users-list">
          <br />
          <hr />
          <h3>Manage Orders {!this.state.ready ? "  -  Loading ..." : ""}</h3>
          <div className="ui ten column grid">
            <div className="row">
              <div className="two wide column">
                <b>
                  <i>Title</i>
                </b>
              </div>
              <div className="three wide column">
                <b>
                  <i>Description</i>
                </b>
              </div>
              <div className="one wide column">
                <b>
                  <i>Score</i>
                </b>
              </div>
              <div className="one wide column">
                <b>
                  <i>User ID</i>
                </b>
              </div>
            </div>
            {this.state.allOrders.map(u => {
              return (
                <div
                  className="row"
                  style={this.active(u.authorID, loggedUser.userLoggedID)}
                  key={u.id}
                >
                  <div className="two wide column">{u.title} -</div>
                  <div className="three wide column">{u.description}</div>
                  <div className="one wide column">{u.score}</div>
                  <div className="one wide column">{u.authorID}</div>

                  <div className="four wide column">
                    {loggedUser.isAdmin === "true" ? (
                      <div className="ui buttons">
                        <button
                          className={
                            u.status ? "ui button positive" : "ui button"
                          }
                          onClick={() => this.toggleStatus(u.id, true)}
                        >
                          In Progress
                        </button>
                        <div className="or" />
                        <button
                          className={
                            u.status ? "ui button" : "ui button positive"
                          }
                          onClick={() => this.toggleStatus(u.id, false)}
                        >
                          Finished
                        </button>
                      </div>
                    ) : (
                      [
                        loggedUser.userLoggedID === u.authorID ? (
                          <div className="ui buttons">
                            <button
                              className={
                                u.status ? "ui button positive" : "ui button"
                              }
                              onClick={() => this.toggleStatus(u.id, true)}
                            >
                              In Progress
                            </button>
                            <div className="or" />
                            <button
                              className={
                                u.status ? "ui button" : "ui button positive"
                              }
                              onClick={() => this.toggleStatus(u.id, false)}
                            >
                              Finished
                            </button>
                          </div>
                        ) : (
                          ""
                        )
                      ]
                    )}
                  </div>

                  <div className="two wide column">
                    {loggedUser.isAdmin === "true" ? (
                      <button
                        className="ui primary button"
                        onClick={() => this.editOrderContainer(u.id)}
                      >
                        Edit
                      </button>
                    ) : (
                      [
                        loggedUser.userLoggedID === u.authorID ? (
                          <button
                            className="ui primary button"
                            onClick={() => this.editOrderContainer(u.id)}
                          >
                            Edit
                          </button>
                        ) : (
                          ""
                        )
                      ]
                    )}
                  </div>

                  <div className="two column">
                    {loggedUser.isAdmin === "true" ? (
                      <button
                        className="ui vertical animated button"
                        onClick={() => this.deleteOrder(u.id)}
                      >
                        <div className="hidden content">Delete</div>
                        <div className="visible content">
                          <i aria-hidden="true" className="delete icon" />
                        </div>
                      </button>
                    ) : (
                      [
                        loggedUser.userLoggedID === u.authorID ? (
                          <button
                            className="ui vertical animated button"
                            onClick={() => this.deleteOrder(u.id)}
                          >
                            <div className="hidden content">Delete</div>
                            <div className="visible content">
                              <i aria-hidden="true" className="delete icon" />
                            </div>
                          </button>
                        ) : (
                          ""
                        )
                      ]
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <br />
        <button className="ui button" onClick={() => this.toggleHidden(1)}>
          Toggle Add New Order
        </button>

        {!this.state.isEditOrderHidden ? this.editOrderContainer() : ""}
        {!this.state.isAddOrderHidden ? <AddOrderForm /> : ""}
      </div>
    );
  }
}
export default withRouter(ManageOrdersPage);
