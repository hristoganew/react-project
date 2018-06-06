import OrdersAPI from "./OrdersAPI";

export default class UsersAPI {
  static generateId() {
    return Math.floor(Math.random() * (10001 - 1 + 1)) + 1;
  }

  static getLoggedUserID() {
    return localStorage.getItem("logged-id");
  }

  static seedAdmin() {
    let admin = {
      email: "admin@admin.com",
      password: "adminpass",
      isAdmin: true,
      id: UsersAPI.generateId()
    };

    let users = JSON.parse(localStorage.getItem("users"));

    if (!users) {
      users = [];
    }

    let doesExist = users.find(u => u.email === "admin@admin.com" && u.isAdmin);

    if (!doesExist) {
      users.push(admin);

      let usersJSON = JSON.stringify(users);
      localStorage.setItem("users", usersJSON);
      console.log("localstorageInitialized");
    }
  }

  static login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let users = JSON.parse(localStorage.getItem("users"));

        let currentUser = users.find(
          u => u.email === email && u.password === password
        );

        if (currentUser) {
          //set logged user id
          localStorage.setItem("logged-id", currentUser.id);
          //set logged user isAdmin
          localStorage.setItem("isAdmin", currentUser.isAdmin);
          resolve(currentUser);
        } else {
          reject("Wrong username or password.");
        }
      }, 1500);
    });
  }

  static register(email, password) {
    return new Promise((resolve, reject) => {
      let users = JSON.parse(localStorage.getItem("users"));

      if (!users) {
        users = [];
      }

      let doesExist = users.find(u => u.email === email);

      if (!doesExist) {
        let user = {
          email: email,
          password: password,
          isAdmin: false
        };
        user.id = UsersAPI.generateId();

        users.push(user);
        let usersJSON = JSON.stringify(users);
        localStorage.setItem("users", usersJSON);

        resolve("Your user registration was successful");
      } else {
        reject("Email already exists");
      }
    });
  }

  static editUser(id, email, password) {
    return new Promise((resolve, reject) => {
      let users = JSON.parse(localStorage.getItem("users"));

      let index = users.findIndex(u => u.id === id);

      if (index) {
        users[index].email = email;
        users[index].password = password;

        let usersJSON = JSON.stringify(users);
        localStorage.setItem("users", usersJSON);

        resolve("Your user update was successful");
      } else {
        reject("Email already exists");
      }
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let users = JSON.parse(localStorage.getItem("users"));

        if (!users || users.length === 0) {
          resolve([]);
        } else {
          resolve(users);
        }
      }, 1000);
    });
  }

  static getUserByID(id) {
    let users = JSON.parse(localStorage.getItem("users"));

    let index = users.find(u => u.id === id);

    return {
      user: index
    };
  }

  static getLoggedUserInfo() {

    return {
      userLoggedID: localStorage.getItem("logged-id"),
      isAdmin: localStorage.getItem("isAdmin")
    };
  }

  static toggleAdmin(id, status) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let users = JSON.parse(localStorage.getItem("users"));

        let index = users.findIndex(u => u.id === id);
        users[index].isAdmin = status;

        let usersJSON = JSON.stringify(users);
        localStorage.setItem("users", usersJSON);

        resolve();
      }, 1500);
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let users = JSON.parse(localStorage.getItem("users"));

        let toDelete = users.find(u => u.id === id);

        console.log(toDelete.id);
        OrdersAPI.deleteByAuthorId(toDelete.id).then(() => {
          users = users.filter(u => u.id !== toDelete.id);

          let usersJSON = JSON.stringify(users);
          localStorage.setItem("users", usersJSON);

          resolve();
        });
      }, 1500);
    });
  }
}
