const express = require("express");
const server = require('./src/server');
const { listening_port, status} = require("./src/utils");

const api = express();
const Server = new server()

Server.connect();
api.use(express.json());

Server.refreshServerUserArray()

api.post("/registerUser", (req,res)=>{
			const userOBJ = {fullname: req.body.name, email: req.body.email, password: req.body.password,
				 username: req.body.username }
			Server.registerUser(userOBJ, (result)=>{if(result){res.send(status.success)}else{res.send(status.error)}})
});

api.post("/loginUser", (req, res) => {
			 Server.SignInUserWithManager(req.body.username, (result)=>{if(result.length > 0){res.send(status.succeded)}else{
				 const userOBJ = {username: req.body.username, password: req.body.password}
				 Server.loginUser(userOBJ, (response)=>{res.send(status.succeded); if(response.valid === true){Server.SignInUser(response);}})

			 }})
});

api.listen(listening_port, () => {
			  console.log(`running server on port ${listening_port}`);
});
