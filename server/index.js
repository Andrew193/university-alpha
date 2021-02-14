const Express=require("express")
const mysql2=require("mysql2")
const jsonParser=Express.json();
const path = require("path");
const connection = null;
const fileUpload = require('express-fileupload');
var ndd = require('near-dup-detection');
const App=Express()
const Script = require("./scripts")
const Script2 = require("./script2")
App.use(jsonParser)
App.use(Express.static(path.join(__dirname, "..", "build")));
App.use(Express.static("public"))
App.use(fileUpload());

App.post("/checkFileM1",jsonParser,(req,res)=>{
ndd("grgrg rtrgrg WFF gfg","grg WFF gfg",function(err, result) {
  console.log(result*100); // from 0 to 1 where 1 - the same documents
});
  Script.ShowPercentagesFirst(req.files.file).then((value)=>{
    res.json({"result":value.reduce((prev,curr)=>prev+=curr,0)/value.length})
  })
})
App.post("/checkFileM2",jsonParser,(req,res)=>{
  Script2.ShowPercentagesSecond(req.files.file).then((value)=>{
    res.json({"result":value.reduce((prev,curr)=>prev+=curr,0)/value.length})
  })
})



App.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"))
});
// start express server on port 5000
App.listen(5000,"localhost", () => {
  console.log("server started on port 5000")
});
