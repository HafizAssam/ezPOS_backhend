const express = require('express')
const {con,knex} = require("./config")
const app = express();

app.use(express.json())
app.get("/", (req, resp) => {  
    con.query('select * from ospos_employees', (err, result) => {
        if (err) {
            resp.send("error ",err) 
        } else {
            resp.send(result)
        }
    })
})


app.post ("/",async (req,resp)=>{
    const data =req.body
    con.query("INSERT INTO ospos_employees SET ?",  data,(err, result,fields)=>{
        if (err) throw err
        resp.send(result)

    })
})  
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