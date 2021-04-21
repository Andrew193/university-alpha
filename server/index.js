const Express = require("express")
const Mysql = require("mysql2")
const jsonParser = Express.json();
const path = require("path");
const Connection = Mysql.createConnection({
  host: "localhost",
  database: "tatarinova",
  password: "radeongraphics",
  user: "root",
}).promise();
const fileUpload = require('express-fileupload');
const App = Express()
const Script = require("./scripts")
const Script2 = require("./script2")
App.use(jsonParser)
App.use(Express.static(path.join(__dirname, "..", "build")));
App.use(Express.static("public"))
App.use(fileUpload());

App.post("/checkFileM1", jsonParser, (req, res) => {
  Connection.query(`select * from ${req.body.lang} where workType="${req.body.workType}"`).then((result, error) => {
    if (!error) {
      Script.ShowPercentagesFirst(req.files.file, result[0]).then((value) => {
        res.json({ "result": value.reduce((prev, curr) => prev += curr, 0) / value.length })
      })
    }
  })
})
App.post("/logdata", jsonParser, (req, res) => {
  Connection.query(`select code from js where code="${String(req.files.file.data).replace(/[\s.,%"']/g, '')}"`).then((result) => {
    if (result[0].length === 0) {
      Connection.query(`INSERT INTO ${req.body.lang} SET code="${String(req.files.file.data).replace(/[\s.,%"']/g, '')}",
      workType="${req.body.workType}"`)
      res.json({ "done": true })
    } else res.json({ "done": false })
  })
})
App.post("/checkFileM2", jsonParser, (req, res) => {
  let resultAll=[]
  Connection.query(`select * from ${req.body.lang} where workType="${req.body.workType}"`).then((result) =>{
    result[0].forEach((value)=>{
      Script2(String(req.files.file.data),value.code, (error, result) => {
        resultAll.push(result)
        if (error){
        res.json({ "result": "Error" })
        }
      })
    })
    console.log(resultAll);
    res.json({ "result": resultAll.reduce((prev, curr) => prev += curr, 0) / resultAll.length })
  })
})

//+ поле в бд
//+ поле в бд
//+ рефакторинг



App.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"))
});
// start express server on port 5000
App.listen(5000, "localhost", () => {
  console.log("server started on port 5000")
});
