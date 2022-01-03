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

  uploadImage(JSONObject, callback) {
    let query = `UPDATE users SET profile_image = ${JSONObject.image} WHERE user_id = ${JSONObject.userID}`;
    this.db.query(query, (err, res) => { if (err !== null) { return callback(res) } else { throw err } });
  }

  registerUser(JSONObject, callback) {
    let database = this.db
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
        "SELECT * FROM users WHERE user_email = (?)",
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
                    email: result[0].user_email,
                    user_id: result[0].user_id,
                    fullname: result[0].user_fullname,
                    image: result[0].profile_image,
                    gender: result[0].user_gender,
                    age: result[0].user_age,
                    weight: result[0].user_weight,
                    height: result[0].user_height,
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
        "SELECT * FROM users WHERE user_username = (?)",
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
                    email: result[0].user_email,
                    user_id: result[0].user_id,
                    fullname: result[0].user_fullname,
                    image: result[0].profile_image,
                    gender: result[0].user_gender,
                    age: result[0].user_age,
                    weight: result[0].user_weight,
                    height: result[0].user_height,
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
