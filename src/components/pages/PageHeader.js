import React from "react";
import { Button } from "semantic-ui-react";
import UsersAPI from "../api/UsersAPI";
import { withRouter } from "react-router";

class PageHeader extends React.Component {
  logOut() {
    localStorage.removeItem("logged-id");
    localStorage.removeItem("isAdmin");

    window.location.reload();
  }

  render() {
    let user = UsersAPI.getLoggedUserInfo();
    //set page label
    let page;
    let loggedAs;
    let button;

    switch (this.props.location.pathname) {
      case "/":
        page = "Home Page";
        break;
      case "/login":
        page = "Login Page";
        break;
      case "/signup":
        page = "Sign Up Page";
        break;

      default:
        page = "Home";
        break;
    }

    if (user.userLoggedID) {
      button = <Button onClick={this.logOut}>Log Out</Button>;
      if (user.isAdmin === "true") {
        loggedAs = "Admin";
      } else {
        loggedAs = "Default user";
      }
    }

    return (
      <div>
        <div className="ui divided grid">
          <div className="row">
            <div className="nine wide column">
              <h1>{page}</h1>
            </div>
            <div className="three wide column">
              <h1>{loggedAs}</h1>
            </div>
            <div className="two wide column">
              <h1>{user.userLoggedID ? ['id - ' + user.userLoggedID] : ''}</h1>
            </div>
            <div className="two wide column">{button}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(PageHeader);
