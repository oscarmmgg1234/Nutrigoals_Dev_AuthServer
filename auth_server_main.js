const express = require("express");
const mysql = require("mysql");
const bcrypt = require('bcryptjs')

const bodyParser = require("body-parser");
const saltRounds = 10;

const app = express();

app.use(express.json());


app.use(bodyParser.urlencoded({ extended: true }));


const db = mysql.createConnection({
			  user: "admin",
			  host: "db.ca1tiucmqwpl.us-west-2.rds.amazonaws.com",
			  port: "3306",
			  password: process.env.password,
			  database: "user",
});

db.connect();
app.get("/usernameStatus", (req, res) => {
		const username = req.body.username;
	
	
			db.query("SELECT COUNT(*) AS userCounts FROM user.users WHERE username = (?)",[username],(err,result)=>{

								res.send({count: result[0].userCounts})
								
								})
			
});


app.post("/register", (req, res) => {
			  const username = req.body.username;
			  const password = req.body.password;
	
		
				bcrypt.hash(password, saltRounds, function(err, hash){
				
				db.query("INSERT INTO user.user_credentials (username, passwrd) VALUES (?,?)",
										[username , hash],(err, result) => {
																if(err){
																							console.log(err);
																							}
																});});
				  
});

app.post("/register/user", (req,res)=>{
			const username = req.body.username;
			const email = req.body.email;
			const name = req.body.name;
			
			db.query("INSERT INTO user.users (username,user_name,user_email) VALUES (?,?,?)", [username,email,name],(err, result) => {console.log(err); })

});

app.post("/login", (req, res) => {
			  const username = req.body.username;
			  const password = req.body.password;
				console.log(`${username}: authentication process init with pass: ${password}`);

			  db.query(`SELECT * FROM user.user_credentials WHERE username = (?)`, [username],
				  			  		      (err, result) => {
										     if(result.length > 0){console.log('found user in db init hashing')
				bcrypt.compare(password, result[0].passwrd,(err,response)=>{if(response){console.log("user Authenticated"); res.send({valid: true});}else{console.log("user not authenticated");res.send({valid: false});}});}
				 else{ res.send({valid: false})}});
							      			
		
});












app.listen(5000, () => {
			  console.log("running server");
});
