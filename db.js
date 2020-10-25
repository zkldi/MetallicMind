const monk = require("monk");
const url = 'localhost:27017/kamaitachidb';
const db = monk(url);

console.log("Connecting to database...");
console.time("DB CONNECT TIME")
db.then(() => {
    console.log("Connection to database successful.");
    console.timeEnd("DB CONNECT TIME");
});

module.exports = db;