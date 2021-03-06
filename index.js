var handle = require("./requestHandler");
var config = require("./config");
const path = require("path");
var express = require("express");
var bodyParser = require('body-parser')
var multer = require("multer");

 
// create application/json parser
var jsonParser = bodyParser.json();

var app = express();
var upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      // 上传文件存在 uploads 下
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      // 使用时间戳作为上传的文件名
      const extname = path.extname(file.originalname);
      console.log(extname);
      cb(null, Date.now() + extname);
    },
  }),
});

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get("/getAllInfos", function (req, res) {
  res.send(handle.readAlbumTagInfos());
});

app.post("/addTag", jsonParser, function (req, res) {
  if(!req.body.value || !req.body.label) {
    res.send("errorrrrrrrrrr!");
    return;
  }
  var nowTags = handle.addTag(req.body.value, req.body.label);
  res.send(nowTags);
});

app.post("/verifyPassword", jsonParser, function (req, res) {
  if(!req.body.password) {
    res.send("errorrrrrrrrrr!");
    return;
  };
  if(req.body.password === config.password) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  };
});

app.post("/upload", upload.array("photos", 100), function (req, res, next) {
  // 上传好后到文件信息在req.files里
  // console.log(req.files);
  // 上传附带的文本域信息在req.body里
  // console.log(req.body);

  var filesPathInfos = req.files.map((item) => item.filename);
  var infos = handle.modifyTagInfos(filesPathInfos, req.body.value);

  res.json({
    ok: true,
    message: "图片上传成功",
    infos,
  });
});

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port);
});
