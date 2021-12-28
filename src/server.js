const DB = require('./mysql_driver')

module.exports = class server extends DB{
constructor(){    
    super()
}
signInUserWith(JSONObject){
    //object = {userID: 2121, signedInTime: moment().add(60, 'minutes')}
    this.signedInUsers.push(JSONObject)
   
}
checkSignIn(id, callback){
    this.signedInUsers.map(obj=>{if(obj.username === id){return callback(obj)}})
    return callback({valid: null})
}
}