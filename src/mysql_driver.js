const mysql = require("mysql");
const { createID, password_hash_rounds } = require("./utils");
const bcrypt = require("bcryptjs");

module.exports = class DB {
  constructor() {
    this.db = mysql.createConnection({
      user: "admin",
      host: "db.ca1tiucmqwpl.us-west-2.rds.amazonaws.com",
      port: "3306",
      password: "Omariscool1234",
      database: "nutrigoalsDB",
    });
  }

  connect() {
    this.db.connect((err) => {
      if (err !== null) throw err;
    });
  }

  registerUser(JSONObject, callback) {
    let database = this.db;
    bcrypt.hash(
      JSONObject.password,
      password_hash_rounds,
      function (err, hash) {
        database.query(
          "INSERT INTO users (user_id, user_fullname, user_email, user_password, user_username) VALUES (?,?,?,?,?)",
          [
            createID(),
            JSONObject.fullname,
            JSONObject.email,
            hash,
            JSONObject.username,
          ],
          (err, result) => {
            if (err === null) {
              return callback(true);
            } else {
              return callback(false);
            }
          }
        );
      }
    );
  }

  loginUser(JSONObject, callback) {
    if (JSONObject.username.includes("@")) {
      //email
      this.db.query(
        "SELECT user_password, user_id, user_email FROM users WHERE user_email = (?)",
        [JSONObject.username],
        (err, result) => {
          if (err !== null) {
            console.log(err);
            return callback({ valid: false });
          } else if (result.length > 0) {
            bcrypt.compare(
              JSONObject.password,
              result[0].user_password,
              (err, results) => {
                if (err !== null) {
                  console.log(err);
                  return callback({ valid: false });
                } else if (results) {
                  return callback({
                    valid: true,
                    username: result[0].user_email,
                    password: result[0].user_password,
                    user_id: result[0].user_id,
                  });
                } else {
                  return callback({ valid: false });
                }
              }
            );
          } else {
            return callback({ valid: false });
          }
        }
      );
    } else {
      //username
      this.db.query(
        "SELECT user_password, user_id, user_username  FROM nutrigoalsDB.users WHERE user_username = (?)",
        [JSONObject.username],
        (err, result) => {
          if (err !== null) {
            console.log(err);
            return callback({ valid: false });
          } else if (result.length > 0) {
            bcrypt.compare(
              JSONObject.password,
              result[0].user_password,
              (err, results) => {
                if (err !== null) {
                  console.log(err);
                  return callback({ valid: false });
                } else if (results) {
                  return callback({
                    valid: true,
                    username: result[0].user_username,
                    password: result[0].user_password,
                    user_id: result[0].user_id,
                  });
                } else {
                  return callback({ valid: false });
                }
              }
            );
          } else {
            return callback({ valid: false });
          }
        }
      );
    }
  }
};
