const mysql = require("mysql");
const { password_hash_rounds } = require("./constants");
const { createDefaultUserMacroGoal } = require("./utilities");
const { createID, status } = require("./utilities");
const bcrypt = require("bcryptjs");

module.exports = class DB {
  constructor() {
    this.columnName = new Map();
    this.db = mysql.createConnection({
      user: "admin",
      host: "db.ca1tiucmqwpl.us-west-2.rds.amazonaws.com",
      port: "3306",
      password: "Omariscool1234",
      database: "nutrigoalsDB",
    });
  }

  connect() {
    this.columnName.set(1, "user_fullname");
    this.columnName.set(2, "user_email");
    this.columnName.set(6, "user_age");
    this.columnName.set(4, "user_weight");
    this.columnName.set(5, "user_physical_level");
    this.columnName.set(3, "user_gender");
    this.columnName.set(7, "user_height");
    this.db.connect((err) => {
      if (err !== null) throw err;
    });
  }

  updateUserInfo(JSONObject, callback) {
    let query = "";
    if (JSONObject.index > 3) {
      query = `UPDATE users SET ${this.columnName.get(JSONObject.index)} = ${
        JSONObject.payload
      } WHERE user_id = '${JSONObject.userID}'`;
    } else {
      query = `UPDATE users SET ${this.columnName.get(JSONObject.index)} = '${
        JSONObject.payload
      }' WHERE user_id = '${JSONObject.userID}'`;
    }
    this.db.query(query, (err, res) => {
      if (err === null) {
        return callback(status.success);
      } else {
        throw err;
      }
    });
  }
  uploadImage(JSONObject, callback) {
    let query = `UPDATE users SET profile_image ='${JSONObject.image}' WHERE user_id = '${JSONObject.userID}'`;
    this.db.query(query, (err, res) => {
      if (err === null) {
        return callback(status.success);
      } else {
        throw err;
      }
    });
  }

  registerUser(JSONObject, callback) {
    let database = this.db;
    let userGoalList = createDefaultUserMacroGoal({
      gender: JSONObject.gender,
      age: JSONObject.user_age,
      weight: JSONObject.user_weight,
      height: JSONObject.user_height,
      fitnessLevel: JSONObject.fitnessLevel,
      weeklyLossGoal: JSONObject.weeklyLossGoal,
    });
    bcrypt.hash(
      JSONObject.password,
      password_hash_rounds,
      function (err, hash) {
        database.query(
          "INSERT INTO users (user_id, user_fullname, user_email, user_password, user_username, user_gender, user_age, user_weight, user_height, user_physical_level, user_weightLossGoal,user_macro_goals, user_water_goal) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            createID(),
            JSONObject.fullname,
            JSONObject.email,
            hash,
            JSONObject.username,
            JSONObject.gender,
            JSONObject.age,
            JSONObject.weight,
            JSONObject.height,
            JSONObject.fitnessLevel,
            JSONObject.weeklyLossGoal,
            `{"calories":${userGoalList[0]},"proteins":${userGoalList[1]},"fats":${userGoalList[2]},"carbohydrates":${userGoalList[3]},"sugars":${userGoalList[4]},"sodiums":${userGoalList[5]}}`,
            13,
          ],

          (err, result) => {
            if (err === null) {
              return callback(true);
            } else {
              console.log(err);
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
                    fitnessLevel: result[0].user_physical_level,
                    weeklyLossGoal: result[0].user_weightLossGoal,
                    userGoals: result[0].user_macro_goals,
                    waterGoal: result[0].user_water_goal,
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
                    fitnessLevel: result[0].user_physical_level,
                    weeklyLossGoal: result[0].user_weightLossGoal,
                    userGoals: result[0].user_macro_goals,
                    waterGoal: result[0].user_water_goal,
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
