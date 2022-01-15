const DB = require("./mysql_driver");
const { status } = require("./utilities");

module.exports = class server extends DB {
  constructor() {
    super();
    this.SignedInUsers = [];
    this.registered_devices = [];
  }

  RegisterDevice(userOBJ){
    var counter = 0; 
    this.registered_devices.map((obj)=>{
      if(obj.device_ip === userOBJ.device_ip){
        counter = 1
      }
    })
    if(counter === 0){
      this.registered_devices.push(userOBJ);
      console.log(this.registered_devices)
    }


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

  client_init(ip, callback){
    
    let result = this.registered_devices.map((obj)=>{if(obj.ip === ip){return obj}})
    if(result.length > 0){
      console.log(this.registered_devices[0].device_ip)
      let subResult = this.SignedInUsers.map((obj)=>{if(obj.user_id === result[0].user_id){return obj;}})
      if(subResult.length > 0){
        
        return callback(subResult[0]);
      }
    }
    else{
      return callback(status.failed);
    }
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
