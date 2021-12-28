const express = require("express");
const server = require('./src/server');
const { listening_port, success } = require("./src/utils");

const api = express();
const Server = new server()

Server.connect();
api.use(express.json());

Server.refreshServerUserArray()

api.post("/registerUser", (req,res)=>{
			const userOBJ = {fullname: req.body.name, email: req.body.email, password: req.body.password,
				 username: req.body.username }
			Server.registerUser(userOBJ, (result)=>{if(result){res.send("succeded")}else{res.send("failed")}})
});

api.post("/loginUser", (req, res) => {
			 Server.SignInUserWithManager(req.body.username, (result)=>{if(result.length > 0){res.send(success)}else{
				 const userOBJ = {username: req.body.username, password: req.body.password}
				 Server.loginUser(userOBJ, (response)=>{res.send(success); if(response.valid === true){Server.SignInUser(response);}})

			 }})
});

api.listen(listening_port, () => {
			  console.log(`running server on port ${listening_port}`);
});
