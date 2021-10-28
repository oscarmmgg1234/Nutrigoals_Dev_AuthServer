module.exports = {
  apps : [{

	name: "Auth_Server",
    script: 'node auth_server_main.js',
    watch: true,
	  env: {
		  "password": "Omariscool1234",}
  }]};
