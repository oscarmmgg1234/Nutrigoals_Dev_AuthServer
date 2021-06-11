module.exports = {
  apps : [{
    name: "nutrigoals auth_server",
    script: 'node auth_server_main.js',
    watch: true,
    env: {
      "password" : "Omariscool1234"
    }

  }, 
],


};
