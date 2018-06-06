import React from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";

class MainPage extends React.Component {
  logOut() {
    localStorage.removeItem("logged-id");
    localStorage.removeItem("isAdmin");

    window.location.reload()
  }

  render() {
    let userLogged = localStorage.getItem("logged-id");
    let isAdmin = localStorage.getItem("isAdmin");

    //set page label
    let page = 'Main Page';

    if(userLogged){
        page += ' logged in as ';
        if(isAdmin === 'true'){
            page += 'Admin';
        }else{
            page += 'Default user';
        }
    }

    if (userLogged) {
      return (
        <div>
          <h1>{page}</h1>
          <Button onClick={this.logOut}>Log Out</Button>
        </div>
      );
    } else {
      return (
        <div>
          <h1>{page}</h1>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Register</Link>
            </li>
          </ul>
        </div>
      );
    }
  }
}

export default MainPage;
