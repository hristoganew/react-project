import React from "react";
import { Form, Button } from "semantic-ui-react";
import InlineError from "../messages/InlineError";
import OrdersAPI from "../api/OrdersAPI";
import { withRouter } from "react-router";

class AddOrderForm extends React.Component {
  state = {
    orderData: {
      title: "",
      description: "",
      score: ""
    },
    loading: false,
    errors: ""
  };

  onChange = e =>
    this.setState({
      orderData: { ...this.state.orderData, [e.target.name]: e.target.value }
    });

  onSubmit = () => {
    const { title, description, score } = this.state.orderData;

    OrdersAPI.addOrder(title, description, score)
      .then(() => {
        window.location.reload();
      })
      .catch(error => {
        this.setState({
          errors: error
        });
      });
  };

  render() {
    const { orderData, errors } = this.state;

    return (
      <div className="ui two column grid">
        <div className="one wide column" />
        <div className="column">
          <Form onSubmit={this.onSubmit.bind(this)}>
            <hr />
            <h3>Add Order</h3>
            {errors && <InlineError text={errors} />}
            <Form.Field>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Bake a cake"
                value={orderData.title}
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
                value={orderData.description}
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
                value={orderData.score}
                onChange={this.onChange}
              />
            </Form.Field>

            <Button primary>Add Order</Button>
            <hr />
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(AddOrderForm);
