var express = require('express');
var router = express.Router();
var User = require("../models/user");
var ObjectId = require('mongoose').Types.ObjectId;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).render('index', {
    title: "Restaurant and Karaoke in DC",
    desc: "Serving the best of Chinese Japanese cuisine, and karaoke lounge with nine private party rooms, featuring with 150,000+ songs to enjoy."
  });
});

router.get('/karaoke', function(req, res, next) {
  res.status(200).render('karaoke', {
    title: "Karaoke (巨星KTV)",
    desc: "Karaoke is relax and best way to show your talent to your friends or the public, our karaoke Lounge with nine privates rooms in small, medium and large size, where you can entertain your party with your friend and family at your own way. Our system is modern and professionally setup, based on the touch screen search monitor to find over 150,000 songs from the 80th to the newest hits. The variety selection in different languages to fit all our guests taste."
  });
});

router.get('/restaurant', function(req, res, next) {
  res.status(200).render('restaurant', {
    title: "Restaurant",
    desc: "Located in heart of Chinatown Washington DC, we combine the best of Chinese and Japanese cultures and soul. Market-fresh, high-end organic ingredients inspiring our uests with delicious dishes, great selection from our authentic Chinese culinary, extensive the sushi bar menu, variety of cold or warm Sake, and our cozy Karaoke with private rooms to add some fun to the night."
  });
});

router.get('/gallery', function(req, res, next) {
  res.status(200).render('gallery', {
    title: "Gallery",
    desc: ""
  });
});

router.get('/terms', function(req, res, next) {
  res.status(200).render('terms', {
    title: "Policy and Regulation",
    desc: ""
  });
});

router.get('/system', function(req, res, next) {
  if (req.cookies.userID === undefined || req.cookies.userID === null) {
    res.status(200).render('vip', {
      UID: req.cookies.userID,
      title: "VIP",
      desc: "Sign up for FREE"
    });
  }
  else {
    User.findOne({
      _id: req.cookies.userID
    }, function(err, users) {
      if (err) return console.error(err);
      if (users && users.priority > 0) {
        res.status(200).render('system', {
          title: "System",
          desc: ""
        });
      }
      else {
        res.status(200).render('vip', {
          UID: req.cookies.userID,
          title: "VIP",
          desc: "Sign up for FREE"
        });
      }
    });
  }
});

router.get('/scheduler', function(req, res, next) {
  if (req.cookies.userID === undefined || req.cookies.userID === null) {
    res.status(200).render('vip', {
      UID: req.cookies.userID,
      title: "VIP",
      desc: "Sign up for FREE"
    });
  }
  else {
    User.findOne({
      _id: req.cookies.userID
    }, function(err, users) {
      if (err) return console.error(err);
      if (users && users.priority > 0) {
        res.status(200).render('scheduler', {
          title: "Scheduler",
          desc: ""
        });
      }
      else {
        res.status(200).render('vip', {
          UID: req.cookies.userID,
          title: "VIP",
          desc: "Sign up for FREE"
        });
      }
    });
  }
});

router.get('/news', function(req, res, next) {
  res.status(200).render('news', {
    title: "News",
    desc: ""
  });
});

router.get('/prize', function(req, res, next) {
  res.status(200).render('prize', {
    title: "Prize",
    desc: ""
  });
});

router.get('/foodanddrink', function(req, res, next) {
  res.status(200).render('foodanddrink', {
    title: "Food and Drink",
    desc: ""
  });
});


router.get('/resetpassword', function(req, res, next) {
  if (ObjectId.isValid(req.query.UID)) {
    res.status(200).render('resetpassword', {
      title: "Reset Password",
      desc: ""
    });
  }
  else {
    res.status(404).render('error', {
      title: "Error 404"
    });
  }
});

router.get('/forgotpassword', function(req, res, next) {
  res.status(200).render('forgotpassword', {
    title: "Forget Password",
    desc: ""
  });
});

router.get('/vip', function(req, res, next) {
  res.status(200).render('vip', {
    UID: req.cookies.userID,
    title: "VIP",
    desc: "Sign up for FREE"
  });
});

module.exports = router;
