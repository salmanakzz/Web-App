const { response } = require('express');
var express = require('express');
var router = express.Router();
let userHelpers = require('../helpers/user-helpers')


/* GET user login page. */


router.get('/', function(req, res, next) {
  
  if (req.session.userloggedIn) {
    res.redirect('/login/userhome')
  }else{
    let signupSuccess = req.session.toast
    let emailval = req.session.emailval
    res.render('user/userlogin', { signupSuccess, emailval, 'loginErr':req.session.loginErr, title: 'Login' ,home:true, link: '/stylesheets/login.css' , script: '/javascripts/loginValidation.js'});
    req.session.loginErr = false
    req.session.toast = false
  }
  
});

router.post('/',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if (response.status) {
      req.session.userloggedIn = true
      req.session.user = response.user
      res.redirect('/login/userhome')
    }else {
      req.session.emailval = req.body.Email
      req.session.loginErr = true
      res.redirect('/login')
    }
  })
  
})

/* GET Signup Page. */
router.get('/signup', function(req, res, next) {
  signupName = req.session.signupName
  signupEmail = req.session.signupEmail
  res.render('user/signup', { signupName,signupEmail,'emailExists':req.session.emailExists, title: 'Signup' ,home:true, link: '/stylesheets/signupValidate.css' , ajax: 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js' , script: '/javascripts/signupValidation.js'});
  req.session.emailExists = false
});

router.post('/signup', function(req, res, next) {

    userHelpers.doSignup(req.body).then((response) =>{
      if (response.emailExists) {
        req.session.emailExists=true
        req.session.signupName = req.body.Name
        req.session.signupEmail = req.body.Email
        res.redirect('/login/signup')
      }else{
        req.session.toast = true
        res.redirect('/login')
      }
     
    })
    
});

let verify = ((req,res,next)=>{ 
  if (req.session.userloggedIn){    
    next()
  }else{
    res.redirect('/login')
  }
})
/* GET User Home Page. */
router.get('/userhome',verify, function(req, res, next) {
  if (req.session.userloggedIn) {
    let user = req.session.user
   res.render('user/user-home',{ user,  title: 'User Home' , link: '/stylesheets/user-home.css' })
  } else {
    res.redirect('/login')
  }
  
});


router.get('/logout', function(req, res, next) {
  req.session.userloggedIn = false
  res.redirect('/login')
});

module.exports = router;

