import React from "react";
import { Link } from "react-router-dom";
import AdminPage from "./AdminPage";
import ManageOrdersPage from "./ManageOrdersPage";
import UsersAPI from "../api/UsersAPI";
import PageHeader from "./PageHeader";

class HomePage extends React.Component {
  loggedIn(isAdmin) {
    if (isAdmin === 'true') {
      return (
        <div>
          <AdminPage />
        </div>
      );
    }else{
        return (
            <div>
              <ManageOrdersPage />
            </div>
          );
    }
  }

  notLogged() {
    return (
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Register</Link>
        </li>
      </ul>
    );
  }

  render() {
    let user = UsersAPI.getLoggedUserInfo();

    return (
      <div>
        <PageHeader />
        {user.userLoggedID ? this.loggedIn(user.isAdmin) : this.notLogged()}
      </div>
    );
  }
}

export default HomePage;
