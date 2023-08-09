const mysql = require ('mysql')
const mysql2 = require ('mysql2')
const con = mysql.createConnection({
host : "localhost",
user : "root",
password: "",
database: "ez_pos"
})

const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'localhost',
      port : 3306,
      user : 'root',
      password : '',
      database : 'ez_pos'
    }
  });

con.connect((err)=>{

if(err){
    console.warn('error ')
}else {
    console.log ('connected')
}
})

module.exports={
    knex,
    con
}