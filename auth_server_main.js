const express = require("express");
const server = require('./src/server');
const { listening_port } = require("./src/utils");

const api = express();
const Server = new server()

Server.connect();
api.use(express.json());

api.post("/registerUser", (req,res)=>{
			const userOBJ = {fullname: req.body.name, email: req.body.email, password: req.body.password,
				 username: req.body.username }
			Server.registerUser(userOBJ, (result)=>{if(result){res.send("succeded")}else{res.send("failed")}})
});

api.post("/loginUser", (req, res) => {
				const userOBJ = {username: req.body.username, password: req.body.password}
			Server.loginUser(userOBJ, (response)=>{res.send({valid: response.valid}); if(response.valid === true){Server.signInUserWith(response);}})
});

api.listen(listening_port, () => {
			  console.log(`running server on port ${listening_port}`);
});
