const DB = require("./mysql_driver");
const { status } = require("./utilities");

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
  SignOutUserWithManager(user_id) {
    let newUserList = this.SignedInUsers.filter(
      (obj) => obj.user_id !== user_id
    );
    this.SignedInUsers = new Array();
    this.SignedInUsers = newUserList;
  }

  refreshServerUserArray() {
    setInterval(() => {
      this.SignedInUsers = new Array();
    }, 8640000);
  }


  uploadImage(JSONObject, callback){
    let ifUserInManager = this.SignedInUsers.map((obj, index)=>{if(obj.user_id === JSONObject.userID){return {...obj, ind: index}}})
    if(ifUserInManager.length > 0){
      this.SignedInUsers[ifUserInManager[0].ind] = {...this.SignedInUsers[ifUserInManager[0].ind], image: JSONObject.image};
    }
    this.uploadImageHandler(JSONObject,(res)=>{return callback(res)})
  }
  //signInManger coming soon
};
