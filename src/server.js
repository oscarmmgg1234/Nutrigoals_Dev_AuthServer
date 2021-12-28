const { CP1250_BIN } = require('mysql/lib/protocol/constants/charsets');
const DB = require('./mysql_driver')

module.exports = class server extends DB{
constructor(){    
    super()
    this.SignedInUsers = []
}
SignInUser(JSONObject){
    var counter = 0;
    this.SignedInUsers.map(obj=>{if(obj.username === JSONObject.username){counter = 1}})
    if(counter === 0){
    this.SignedInUsers.push(JSONObject)
    }
}
SignInUserWithManager(id, callback){
    let obj = this.SignedInUsers.map(obj=>{if(obj.username === id ){return obj}})
    return callback(obj)
}
refreshServerUserArray(){
    setInterval(()=>{this.SignedInUsers = new Array()}, 8640000)
}
//signInManger coming soon
}