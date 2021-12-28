const { v4: uuidv4 } = require('uuid');

const listening_port = 5000;
const password_hash_rounds = 10;
const success = {valid: true};

function createID(){
    return uuidv4();
}

module.exports = {listening_port, createID, password_hash_rounds, success}

