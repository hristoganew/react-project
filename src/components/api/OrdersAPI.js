import UsersAPI from './UsersAPI'
export default class OrdersAPI {
  static generateId() {
    return Math.floor(Math.random() * (10001 - 1 + 1)) + 1;
  }

  static addOrder(title, description, score) {
    return new Promise((resolve, reject) => {
      let orders = JSON.parse(localStorage.getItem("orders"));

      if (!orders) {
        orders = [];
      }

      let doesExist = orders.find(u => u.title === title);

      if (!doesExist) {
        let loggedUserInfo = UsersAPI.getLoggedUserInfo();

        let order = {
          title: title,
          description: description,
          score: score,
          authorID: loggedUserInfo.userLoggedID,
          status: true
        };

        order.id = OrdersAPI.generateId();

        orders.push(order);
        let ordersJSON = JSON.stringify(orders);
        localStorage.setItem("orders", ordersJSON);

        resolve("Your successful added an order");
      } else {
        reject("Order already exists");
      }
    });
  }

  static editOrder(id, title, description, score) {
    return new Promise((resolve, reject) => {
      let orders = JSON.parse(localStorage.getItem("orders"));

      let index = orders.findIndex(u => u.id === id);

      if (index) {
        orders[index].title = title;
        orders[index].description = description;
        orders[index].score = score;

        let ordersJSON = JSON.stringify(orders);
        localStorage.setItem("orders", ordersJSON);

        resolve("Your order update was successful");
      } else {
        reject("There was an error updating the order");
      }
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let orders = JSON.parse(localStorage.getItem("orders"));

        if (!orders || orders.length === 0) {
          resolve([]);
        } else {
          resolve(orders);
        }
      }, 1000);
    });
  }

  static toggleStatus(id, status) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let orders = JSON.parse(localStorage.getItem("orders"));

        let index = orders.findIndex(u => u.id === id);
        orders[index].status = status;

        let ordersJSON = JSON.stringify(orders);
        localStorage.setItem("orders", ordersJSON);

        resolve();
      }, 1500);
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let orders = JSON.parse(localStorage.getItem("orders"));
        let index = orders.findIndex(n => n.id === id);
        orders.splice(index, 1);

        let ordersNotes = JSON.stringify(orders);
        localStorage.setItem("orders", ordersNotes);

        resolve();
      });
    });
  }

  static deleteByAuthorId(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let orders = JSON.parse(localStorage.getItem("orders"));

        console.log(orders);

        orders = orders.filter(n => n.authorID !== id);

        console.log(orders);

        let jsonOrders = JSON.stringify(orders);
        localStorage.setItem("orders", jsonOrders);

        resolve();
      });
    });
  }

  static getOrder(id) {
    let orders = JSON.parse(localStorage.getItem("orders"));

    let index = orders.find(u => u.id === id);

    return {
      order: index
    };
  }
}
