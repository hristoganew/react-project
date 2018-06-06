import React from "react";
import ManageUsersPage from "./ManageUsersPage";
import ManageOrdersPage from "./ManageOrdersPage";

class AdminPage extends React.Component {
  render() {
    return (
      <div>
        <ManageUsersPage />
        <ManageOrdersPage />
      </div>
    );
  }
}

export default AdminPage;
