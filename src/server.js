const bcryptjs = require("bcryptjs");
const DB = require("./mysql_driver");
const { password_hash_rounds } = require("./utils");

module.exports = class server extends DB {
  constructor() {
    super();
    this.SignedInUsers = [];
  }
  SignInUser(JSONObject) {
    var counter = 0;
    this.SignedInUsers.map((obj) => {
      if (obj.username === JSONObject.username) {
        counter = 1;
      }
    });
    if (counter === 0) {
      this.SignedInUsers.push(JSONObject);
    }
  }
  SignInUserWithManager(userObj, callback) {
    let obj = this.SignedInUsers.map((obj) => {
      if (
        obj.username === userObj.username &&
        obj.user_id === userObj.user_id
      ) {
        return obj;
      }
    });
    return callback(obj);
  }
  SignOutUserWithManager(user_id){
    let newUserList = this.SignedInUsers.filter(obj=>obj.user_id !== user_id)
    this.SignedInUsers = new Array()
    this.SignedInUsers = newUserList;
  }

  refreshServerUserArray() {
    setInterval(() => {
      this.SignedInUsers = new Array();
    }, 8640000);
  }

  //signInManger coming soon
};
