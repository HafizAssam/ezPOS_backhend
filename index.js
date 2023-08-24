const express = require("express");
const{ con,query} = require("./config");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(cookieParser());
app.use(express.json());


app.get("/", (req, resp) => {  
    con.query('select * from ospos_employees', (err, result) => {
        if (err) {
            resp.send("error ",err) 
        } else {
            resp.send(result)
        }
    })
})


app.post("/", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const userExist = await con.query(
        "select * from ospos_employees where username = ?",
        [username]
      );
      if (userExist) {
        return res.status(400).json({
          message: "user already exist",
        });
      }
      const hashPassword = await bcrypt.hash(password, 10);
  
      const accessToken = jwt.sign(
        {
          username: username,
        },
        "secret",
        "1h"
      );
  
      const refreshToken = jwt.sign(
        {
          username: username,
        },
        "secret",
        "1h"
      );
  
      const newUser = await con.query(
        "insert into ospos_employees(username,password,refreshToken) values(?,?,?)",
        [username, hashPassword, refreshToken]
      );
  
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
      });
  
      res.status(201).json({
        message: "user created",
        accessToken: accessToken,
      });
    } catch (error) {
      res.status(500).json({
        message: "Somthing went wrong",
        error: error.message,
      });
    }
  });
  
  app.post("/login", async (req, res) => {
    try {
      const { username, person_id } = req.body;
      // const hashPassword = bcrypt.compare(password, 10);
  
      const user = await query(
        "select * from ospos_employees where username = ? and person_id = ?",
        [username, person_id]
      );
  
      if (!user) {
        return res.status(400).json({
          message: "user not found",
        });
      }
      const pass = user.person_id;
      // const match = await bcrypt.compare(password, pass);
      // if (!match) {
      //   return res.status(400).json({
      //     message: "password not match",
      //   });
      // }
      const accessToken = jwt.sign(
        {
          username: username,
        },
        "secret",
        
      );
  
      const refreshToken = jwt.sign(
        {
          username: username,
        },
        "secret",
        
      );
  
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
      });
  
      res.status(201).json({
        message: "user login",
        accessToken: accessToken,
      });
    } catch (error) {
      res.status(500).json({
        message: "Somthing went wrong",
        error: error.message,
      });
    }
  });
  


// app.post ("/",async (req,resp)=>{
//     const data =req.body
//     con.query("INSERT INTO ospos_employees SET ?",  data,(err, result,fields)=>{
//         if (err) throw err
//         resp.send(result)

//     })
// })  
// app.put ("/",(req,resp)=>{
//     const data=["Ibrahim","Jwad",2000-1-31, "0321229291", "M",3]
//     con.query("update student SET Student_Name=? ,Father_name=?,Birth_date=?,phone=?,gender=?, where id=?" ,data ,(err,result,fields)=>{
//         if (err) throw err
//         resp.send(result)
//     })
    
// })
app.put("/:person_id",(req,resp)=>{
    const data =[req.body.username  ,req.body. password, req.body.deleted,req.body. hash_version,req.body.language ,req.body.language_code ,req.body.org-id , req.params.person_id ]
    con.query("UPDATE  ospos_employees SET username=? , password=? , deleted=?, hash_version=? ,language=?,language_code=?,org_id=? where person_id=? " , 
    data ,(err,result,feield)=>{
if (err)throw err
resp.send(result)
    })
    resp.send ("update api working")
})

app.delete("/:person_id",(req, resp)=>{
con.query ("DELETE FROM ospos_employees WHERE person_id =" + req.params.person_id,(err,result)=>{
    if (err)throw err
resp.send(result)

})
})
app.listen(3000)