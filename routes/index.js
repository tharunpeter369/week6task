 const { compare } = require('bcrypt');
var express = require('express');
const { reject } = require('promise');
var router = express.Router();
const promise=require('promise')
const bcrypt = require('bcrypt');
const saltRounds = 10;
// var MongoClient=require('mongodb').MongoClient
// var url="mongodb://localhost:27017"
var db=require('../config/connection')

// var user='tharun';
// var password=369;

/* GET home page. */
router.get('/', function(req, res, next) 
{
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  if(req.session.loggedIn)
  {
    res.redirect('/home/home')
  }else{
    res.render('index1', {layout:'loginlayout',title: 'Express',auth:req.session.loginErr});
       req.session.loginErr=false;
  }  
});

router.post('/submit',function(req,res,next){
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  function check(){
    let loginStatus=false
    let response={}
      return new promise(async(resolve,reject)=>{
      let user=await db.get().collection('user').findOne({email:req.body.your_email})
      console.log(user)
      if(user){
        bcrypt.compare(req.body.passw, user.pass).then(function(result) {
          console.log(result)
          // result == true

            if(result)
            {
              req.session.userName=user.name
              resolve(loginStatus=true)
            }else{
              reject(loginStatus)
            }
        })
      }else{
         reject(loginStatus)
      } 
     });
  }
  
  check().then((result) => {
    if(result==true){
      req.session.loggedIn=true;
    
      res.redirect('/home/home')
    }
  }).catch((err) => {
      console.log(err)
      req.session.loginErr=true
      res.redirect('/') 
  });

})

router.get('/signup', function(req, res, next) {
  if(req.session.loggedIn)
  {
    res.redirect('/home/home')
  }else{   
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.render('signup', {layout:'loginlayout', title: 'Express',auth: req.session.userExist}); 
  req.session.userExist=false;
  }
});




module.exports = router;
