const Express=require("express")
const Mysql=require("mysql2")
const jsonParser=Express.json();
const path = require("path");
const Connection=Mysql.createConnection({
  host: "localhost",
  database: "tatarinova",
  password: "radeongraphics",
  user: "root",
}).promise();
const fileUpload = require('express-fileupload');
const App=Express()
const Script = require("./scripts")
const Script2 = require("./script2")
App.use(jsonParser)
App.use(Express.static(path.join(__dirname, "..", "build")));
App.use(Express.static("public"))
App.use(fileUpload());

App.post("/checkFileM1",jsonParser,(req,res)=>{
  Connection.query("select * from js").then((result,error)=>{
    if(!error){
    Script.ShowPercentagesFirst(req.files.file,result[0]).then((value)=>{
      console.log(value);
      res.json({"result":value.reduce((prev,curr)=>prev+=curr,0)/value.length})
    })
    }
  })
})
App.post("/logdata",jsonParser,(req,res)=>{
  Connection.query(`INSERT INTO js SET code="${String(req.files.file.data).replace(/[\s.,%"']/g, '')}" 
  WHERE code NOT IN (SELECT * FROM js)`)
  res.json({"done":true})
})
App.post("/checkFileM2",jsonParser,(req,res)=>{
  Script2(String(req.files.file.data),(error,result)=>{if(error)
    console.log(error);
  else
res.json({"result":result})
})
})



App.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"))
});
// start express server on port 5000
App.listen(5000,"localhost", () => {
  console.log("server started on port 5000")
});
