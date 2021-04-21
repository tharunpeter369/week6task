var express = require("express");
var router = express.Router();
var { ObjectId } = require("mongodb");
const { resolve, reject } = require("promise");
var admin = "tharun";
var password = 369;
const promise = require("promise");
var db = require("../config/connection");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/adminlogin", function (req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  if (!req.session.adminLogin) {
    res.render("adminlogin", {
      layout: "loginlayout",
      auth: req.session.logerr,
    });
    req.session.logerr = false;
  } else {
    res.redirect("/admin/adminhometemplate");
  }
});

router.get("/adminlogout", function (req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  req.session.adminLogin = false;
  res.redirect("/admin/adminlogin");
});

router.post("/submit", function (req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  if (admin == req.body.your_name && password == req.body.passw) {
    req.session.adminLogin = true;
    res.redirect("/admin/adminhometemplate");
  } else {
    req.session.logerr = true;
    res.redirect("/admin/adminlogin");
  }
});

const adminlogin = (req, res, next) => {
  if (req.session.adminLogin) {
    next();
  } else {
    res.redirect("/admin/adminlogin");
  }
};

router.get("/adminhometemplate", adminlogin, function (req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  return new promise(async (resolve, reject) => {
    await db
      .get()
      .collection("user")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        console.log("ko");
        console.log(result);
        res.render("adminhometemplate", { result: result });
      });
  });
});

router.get("/delete/:id", function (req, res) {
  // console.log(req.params.id)
  db.get()
    .collection("user")
    .deleteOne({ _id: ObjectId(req.params.id) });
  res.redirect("/admin/adminhometemplate");
});

router.get("/edit/:id", function (req, res) {
  // console.log(req.params.id)
  function check() {
    return new promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection("user")
        .findOne({ _id: ObjectId(req.params.id) });
      console.log(user);
      res.render("editform", { user: user });
    });
  }
  check();
});

router.post("/adminsubmit/", function (req, res) {
  console.log(myquery);
  console.log(req.body);
  var myquery = { _id: ObjectId(req.body.id) };

  bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
    console.log(hash);
    var newpass = hash;
    console.log(newpass);

    var newvalues = {
      $set: { name: req.body.name, email: req.body.email, pass: newpass },
    };

    return new promise(async (resolve, reject) => {
      await db
        .get()
        .collection("user")
        .updateOne(myquery, newvalues, function (err, res) {
          if (err) {
            console.log(err);
          } else {
            console.log("1 document updated");
            resolve((ok = true));
          }
        });
    }).then((result) => {
      console.log(result);
      res.redirect("/admin/adminhometemplate");
    });

    // db.get().collection('user').insertOne({name:req.body.name,email:req.body.email,pass:hash})
    // req.session.userName=req.body.name
    // console.log(req.session.userName);
    // console.log(hash)
    // res.redirect('/admin/adminhometemplate');
  });

  // var newvalues = {
  //   $set: {
  //     name: req.body.name,
  //     email: req.body.email,
  //     pass: req.body.password,
  //   },
  // };
  // return new promise(async (resolve, reject) => {
  //   await db
  //     .get()
  //     .collection("user")
  //     .updateOne(myquery, newvalues, function (err, res) {
  //       if (err) throw err;
  //       console.log("1 document updated");
  //     });
  //   res.redirect("/admin/adminhometemplate");
  // });
});

router.get("/adminadduser", function (req, res) {
  res.render("adminadduser", { auth: req.session.adminadduser });
  req.session.adminadduser = false;
});

router.post("/submitadduser", function (req, res, next) {
  db.get()
    .collection("user")
    .findOne({ email: req.body.email })
    .then((result) => {
      if (result) {
        console.log("user already exist");
        req.session.adminadduser = true;
        res.redirect("/admin/adminadduser");
      } else {
        bcrypt.hash(req.body.pass, saltRounds).then(function (hash) {
          db.get()
            .collection("user")
            .insertOne({
              name: req.body.name,
              email: req.body.email,
              pass: hash,
            });
          req.session.userName = req.body.name;
          console.log(req.session.userName);
          console.log(hash);
          res.redirect("/admin/adminhometemplate");
        });

        // console.log('new user')
        // db.get().collection('user').insertOne(req.body)
        // req.session.userName=req.body.name
        // console.log(req.session.userName);
        // res.redirect('/admin/adminhometemplate');
      }
    });
});

router.post("/", function (req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  // console.log(req.body)

  db.get()
    .collection("user")
    .findOne({ email: req.body.email })
    .then((result) => {
      if (result) {
        console.log(result);
        console.log("user already exist");
        req.session.userExist = true;
        res.redirect("/signup");
      } else {
        console.log("new user");
        console.log(req.body);

        bcrypt.hash(req.body.pass, saltRounds).then(function (hash) {
          db.get()
            .collection("user")
            .insertOne({
              name: req.body.name,
              email: req.body.email,
              pass: hash,
            });
          req.session.userName = req.body.name;
          console.log(req.session.userName);
          req.session.loggedIn = true;
          res.redirect("/home/home");
          console.log(hash);
          // Store hash in your password DB.
        });
      }
    });
});

module.exports = router;

//   router.post('/submitadduser', function(req, res, next) {
//     console.log(req.body)
//     db.get().collection('user').insertOne(req.body)
//     console.log('tharun')
//     res.redirect('/admin/adminhometemplate');
// });

// router.post('/adminsubmit/',function(req,res){
//   db.get().collection('user').findOne({email:req.body.email})
//   .then(result=>{
//     if(result){
//       console.log('user existed during edit')
//     }else{
//       var myquery = { _id: ObjectId(req.body.id) };
//       console.log(myquery)
//       console.log(req.body)
//       var newvalues = { $set: {name: req.body.name, email: req.body.email,pass:req.body.password }};
//       return new promise(async(resolve,reject)=>{
//         await db.get().collection("user").updateOne(myquery, newvalues, function(err, res) {
//           if (err) throw err;
//           console.log("1 document updated");
//         });
//         res.redirect('/admin/adminhometemplate');
//       })

//     }
//   })
//   })
