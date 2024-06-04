const mysql = require('mysql');
require('dotenv').config();

// async function connectDatabase(){
  const con = mysql.createConnection({
    host: process.env.INSTANCE_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  
  // con.connect(function(err) {
  //   if (err){throw err}
  //   console.log("Connected!");

  //   const defaultProfilePicture = "https://storage.googleapis.com/peaktime-data/icon.jpg";

  //   const query = 'INSERT INTO accounts (id, email, username, password, birthdate, profilePictureUrl, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  //   const values = [5, 'kevinrazor', 'username', 'password', 'birthdate', defaultProfilePicture, 'createdAt', 'updatedAt'];

  //   con.query(query,values);
  //   con.end();
  // });

  // return con;
// }



module.exports = con;