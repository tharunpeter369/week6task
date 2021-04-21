var express = require('express');
var router = express.Router();
var db=require('../config/connection')
const bcrypt = require('bcrypt');
const saltRounds = 10;

// var MongoClient=require('mongodb').MongoClient
// var url="mongodb://localhost:27017"


/* GET home page. */


router.post('/', function(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    // console.log(req.body)

    db.get().collection('user').findOne({email:req.body.email})
    .then(result =>{
        if(result){
            console.log(result)
            console.log('user already exist')
            req.session.userExist=true;
            res.redirect('/signup');
        }else{
            console.log('new user')
            console.log(req.body)

            bcrypt.hash(req.body.pass, saltRounds).then(function(hash) {
                db.get().collection('user').insertOne({name:req.body.name,email:req.body.email,pass:hash}) 
                req.session.userName=req.body.name
                console.log(req.session.userName);
                req.session.loggedIn=true;
                res.redirect('/home/home');
                console.log(hash)
                // Store hash in your password DB.
            });
           
        }
    })
});


// router.post('/', function(req, res, next) {
//     MongoClient.connect(url,function(err,client){
//         if(err){
//             console.log(err)
//         }else{
//             console.log(req.body)
//             client.db('signin').collection('user').insertOne(req.body)       
//         }
//     })
//     console.log('tharun')
//     res.send('helloo');
// });

module.exports = router;