var express = require('express');
const session = require('express-session');
var router = express.Router();

var content=[
  {name:"Maldives",pic:"/images/pic1.jpg"},
  {name:'Prague',pic:"/images/pic2.jpg"},
  {name:'Newzealand',pic:'/images/pic3.jpg'}
]

/* GET home page. */
router.get('/home', function(req, res, next) {
  if(req.session.loggedIn==true){
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.render('home', {title: req.session.userName,cont:content});
  }else{
    res.redirect('/')
  }
 
});


router.get('/logout',function(req,res,next){
  req.session.loggedIn=false;
  res.redirect('/')
  // res.send('hiii')
})



module.exports = router;
