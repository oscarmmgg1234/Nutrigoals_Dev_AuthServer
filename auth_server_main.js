
const express = require("express");
const req = require("express/lib/request");
const server = require("./src/server");
const { listening_port, status, password_hash_rounds } = require("./src/utils");

const api = express();
const Server = new server();

Server.connect();
api.use(express.json());

Server.refreshServerUserArray();

api.post("/registerUser", (req, res) => {
  const userOBJ = {
    fullname: req.body.name,
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
  };
  Server.registerUser(userOBJ, (result) => {
    if (result) {
      res.send(status.success);
    } else {
      res.send(status.error);
    }
  });
});

api.post("/loginUser", (req, res) => {
  //search for user in
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
});

api.post("/signOutUser", (req, res) => {
  Server.SignOutUserWithManager(req.body.user_id);
});

api.post('/uploadImage', (req, res) => {
  Server.uploadImage({ userID: req.body.userID, image: req.body.image }, (result) => { res.send(result)})
})
api.listen(listening_port, () => {
  console.log(`running server on port ${listening_port}`);
});
