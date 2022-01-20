const express = require("express");
const server = require("./src/server");
const { listening_port } = require("./src/constants");
const { status } = require("./src/utilities");

const api = express();
const Server = new server();

Server.connect();
api.use(express.json({ limit: "20mb" }));

Server.refreshServerUserArray();

api.post("/registerUser", (req, res) => {
  //check if request userObject is valid
  if (
    req.body.username &&
    req.body.email &&
    req.body.password &&
    req.body.gender &&
    req.body.weight &&
    req.body.height &&
    req.body.age &&
    req.body.name &&
    req.body.fitnessLevel &&
    req.body.weeklyLossGoal
  ) {
    const userOBJ = {
      fullname: req.body.name,
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      gender: req.body.gender,
      user_age: req.body.age,
      user_weight: req.body.weight,
      user_height: req.body.height,
      fitnessLevel: req.body.fitnessLevel,
      weeklyLossGoal: req.body.weeklyLossGoal,
    };
    //register user
    Server.registerUser(userOBJ, (result) => {
      if (result) {
        res.send(status.succeded);
      } else {
        res.send(status.failed);
      }
    });
  } else {
    res.send(status.failed);
  }
});

api.post("/clientInit", (req, res) => {
  Server.client_init(req.ip, (result) => {
    res.send(result);
  });
});

api.post("/loginUser", (req, res) => {
  //check if request userObject is valid
  if (req.body.username && req.body.password) {
    //search for user in in usermanager
    Server.SignInUserWithManager(
      { username: req.body.username, user_id: req.body.user_id },
      (result) => {
        if (result.length > 0 && result[0] !== undefined) {
          res.send(result[0]);
        } else {
          const userOBJ = {
            username: req.body.username,
            password: req.body.password,
          };
          //if usermanager dont have user then server signs in normally and stores user in usermanager for 1 day
          Server.loginUser(userOBJ, (response) => {
            if (response.valid === true) {
              res.send(response);
              Server.SignInUser(response);
            } else {
              res.send(status.failed);
            }
          });
        }
      }
    );
  } else {
    res.send(status.invalidUserOBJ);
  }
});

api.post("/signOutUser", (req, res) => {
  Server.SignOutUserWithManager(req.body.user_id);
});

api.post("/uploadImage", (req, res) => {
  Server.uploadImage(
    { userID: req.body.user_id, image: req.body.image },
    (result) => {
      res.send(result);
    }
  );
});

api.post("/updateUserAccountInfo", (req, res) => {
  Server.updateUserInfo(
    {
      index: req.body.index,
      payload: req.body.payload,
      userID: req.body.userID,
    },
    (result) => {
      res.send(result);
    }
  );
});

api.post("/updateMacroGoals", (req, res) => {
  Server.updateMacroGoals(req.body);
  res.send(status.success);
});

api.post("/updateWaterGoals", (req, res) => {
  Server.updateWaterGoals(req.body);
  res.send(status.success);
});

api.post("/updateWaterCurrent", (req, res) => {

  if (req.body.waterCurrent && req.body.userID ) {
    
    Server.updateWaterCurrent({
      waterCurrent: req.body.waterCurrent,
      userID: req.body.userID,
    });
    res.send(status.succeded);
  } else {
    res.send(status.failed);
  }
});

api.post("/timing", (req, res) => {
  res.send(status.succeded);
});

api.listen(listening_port, () => {
  console.log(`running server on port ${listening_port}`);
});
