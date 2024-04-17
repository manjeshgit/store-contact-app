var mysql = require('mysql');

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "store_contact_db"
});

conn.connect(function(err) {
    if (err) throw err;
    console.log('Database is connected successfully !');
  });
  module.exports = conn;

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });
// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "INSERT INTO get_token (access_token) VALUES ('gv45s12linektojhn5ai94rb6d02697f')";
//     con.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("1 record inserted");
//     });
//   });