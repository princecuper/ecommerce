 var mongoose = require('mongoose')
 var bcrypt = require('bcrypt'); //require('bcrypt-nodejs') ;

 var Schema = mongoose.Schema

 /* the user schema attribute / characteristics / fields */
 var UserSchema = new Schema({
     email: {
         type: String,
         unique: true,
         lowercase: true
     },
     password: {
         type: String,
         required: true
     },

     profile: {
         name: {
             type: String,
             default: ''
         },
         picture: {
             type: String,
             default: ''
         }
     },
     address: String,
     history: [{
         date: Date,
         paid: {
             type: Number,
             default: 0
         },
         //item:{type:Schema,Types,ObjectId,refs ''}
     }]

 })

 /* Hash the password before we even save it to the database  */
 UserSchema.pre('save', function (callback) {
     const SALTROUNDS = 10
     var user = this
     if (!user.isModified) {
         return callback()
     }
     bcrypt.genSalt(SALTROUNDS, function (err, salt) {
         if (err) {
             return callback(err)
         }
         bcrypt.hash(user.password, salt, null, function (err, hash) {
             if (err) {
                 return callback(err)
             }
             user.password = hash
             callback()
         })
     })

 });



 /* compare password in the database and that the user type in */

 UserSchema.methods.comparePassword = function (password) {
     return bcrypt.compareSync(password, this.password)
 }



 module.exports = mongoose.model('User', UserSchema)