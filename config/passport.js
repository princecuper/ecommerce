var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var User = require('../models/user')


// serialize and deserialize
passport.serializeUser(function(user,cb){
  cb(null,user._id)  

})

passport.deserializeUser(function(id, cb){
    User.findById(id,function(err,user){
        cb(null,user)

    })
})
    

 // Middleware

passport.use('local-login',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:true
},function(req,email,password,cb){
    User.findOne({email:email},function(err,user){
        if (err) return cb(err)
        if (!user){
            return cb(null,false,req.flash('loginMessage','No user has been found'))
        }
        if (user.password!= password){
            return cb(null,false,req.flash('loginMessage','Oops! Wrong Password'))
        }
        if (!user.comparePassword(password)){
            return cb(null,false,req.flash('loginMessage', "wrooooong"))
        }
        return cb(null,user)
    })
})) 

// custom function to validate
exports.isAuthenticated = function(req,res,cb){
    if (req.isAuthenticated()){
        return cb()
    }
    res.redirect('/login')
}
