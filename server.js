var express = require('express');
var morgan = require('morgan');
var mongoose= require("mongoose")
var bodyParser = require('body-parser')
var ejs_mate = require('ejs-mate');
var ejs  = require('ejs');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session)
var passport = require ('passport')
var secret = require('./config/secret')
var User = require('./models/user')

var app = express();

mongoose.connect(secret.database,function(err){
  if (err){
    console.log(err)
  }else{
    console.log("Connected to the database")
  }
})

//Middleware
app.use(express.static(__dirname +'/public'))
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());
app.use(session({
  resave:true,
  saveUninitialized:true,
  secret:secret.secretKey,
  store:new MongoStore({url:secret.database, autoReconnect:true })
}));
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
app.use(function(req, res, cb){
  res.locals.user = req.user
  cb()
})

app.engine('ejs',ejs_mate)
app.set('view engine','ejs')

app.use(express.static(__dirname + "/public"))

var mainRoutes = require('./routes/main')
var userRoutes = require('./routes/user')
app.use(mainRoutes)
app.use(userRoutes)


app.listen(secret.port,function(err){
  if (err) throw err;
  console.log('server is Running on port ' + secret.port);
});
