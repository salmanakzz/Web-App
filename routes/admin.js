var express = require('express');
var router = express.Router();
let userHelpers = require('../helpers/user-helpers')
var Handlebars = require('handlebars');



/* GET admin login page. */
router.get('/', function(req, res, next) {
  if (req.session.adminLoggedIn) {
    res.redirect('/admin/adminhome')
    
  }else{
    let adminEmailval = req.session.adminEmailval
    res.render('admin/adminlogin', { adminEmailval, 'adminloginErr' : req.session.adminloginErr, title: 'Admin Login' ,home:true, link: '/stylesheets/login.css' , script: '/javascripts/loginValidation.js'});
    req.session.adminloginErr = false
  }
});

router.post('/', function(req, res, next) {

  userHelpers.adminLogin(req.body).then((response)=>{
    
    if (response.status) {
      req.session.adminLoggedIn = true
      req.session.admin = response.admin
      res.redirect('/admin/adminhome')
    }else {
      req.session.adminloginErr = true
      req.session.adminEmailval = req.body.Email
      res.redirect('/admin')
    }
  })
});


/* GET Admin Home Page. */
let verify2 = ((req,res,next)=>{ 
  if (req.session.adminLoggedIn){    
    next()
  }else{
    res.redirect('/admin')
  }
})
router.get('/adminhome',verify2, function(req, res, next) {

  res.render('admin/admin-home' ,{ admin:true, title: 'Admin Home' , link: '/stylesheets/admin-home.css' });
});


router.get('/users-details', function(req, res, next) {
 
  userHelpers.getAllUsers().then((users)=>{
    if (req.session.adminLoggedIn) {
      let addtoast = req.session.toast2
    res.render('admin/users-details' ,{ addtoast, admin:true, title: 'Users Details' , users , link: '/stylesheets/users-details.css' ,script: '/javascripts/delete-user-confirm.js'});
    req.session.toast2 = false
    }else{
      res.redirect('/admin')
    }
})
 
});

router.post('/users-details', function(req, res, next) {
  userHelpers.getFindUsers(req.body).then((usersFind)=>{
    
    res.render('admin/users-details' ,{ admin:true, title: 'Users Details' , usersFind , link: '/stylesheets/users-details.css' ,script: '/javascripts/delete-user-confirm.js',script2:'/javascripts/deletePopup.js'});
  })
 
});

router.get('/add-user', function(req, res, next) {
  if (req.session.adminLoggedIn) {
    let addName = req.session.AddName
    let addEmail = req.session.AddEmail 
    res.render('admin/add-user',{ addEmail, addName,'emailExists':req.session.AddemailExists, admin:true, title: 'Add User' , link: '/stylesheets/signupValidate.css' , ajax: 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js' , script: '/javascripts/signupValidation.js' })
    req.session.AddemailExists = false
  } else {
    res.redirect('/admin')
  }
 
});

router.get('/delete-user/:id',(req,res)=>{
  if (req.session.adminLoggedIn) {
    let userID = req.params.id
    userHelpers.deleteUser(userID).then((response)=>{
      res.redirect('/admin/users-details')
    })
  }else{
    res.redirect('/admin')
  }

})

router.post('/add-btn', function(req, res, next) {

  userHelpers.addUser(req.body).then((response) =>{
    if (response.emailExists) {
      req.session.AddemailExists=true
      req.session.AddName = req.body.Name
      req.session.AddEmail = req.body.Email
      res.redirect('/admin/add-user')
    }else{
      req.session.toast2 = true
      res.redirect('/admin/users-details')
    }
  })

});

router.get('/edit-user/', async (req, res) =>{
  console.log(req.query.id);
  if (req.session.adminLoggedIn) {
    let userOne = await userHelpers.getOneUser(req.query.id)

  res.render('admin/edit-user',{ userOne, admin:true, 'emailExist':req.session.EditemailExists,  title: 'Edit User' , link: '/stylesheets/signupValidate.css' , ajax: 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js' , script: '/javascripts/editUserValidation.js' })
  req.session.EditemailExists = false
  } else {
    res.redirect('/admin')
  }
  
});

router.post('/edit-user/:id', (req, res) =>{
  let id = req.params.id
  userHelpers.updateUser(req.params.id,req.body).then((response)=>{
    if (response.user) {
      req.session.EditemailExists = true
      console.log(req.session.EditemailExists);
      res.redirect('/admin/edit-user')
    }else{
      res.redirect('/admin/users-details')
    }
    
  })
 
})

router.get('/logout', function(req, res, next) {
  req.session.adminLoggedIn = false
  res.redirect('/admin');
});

module.exports = router;