const router = require("express").Router();
const db = require('../models/database');
const util = require('../helpers');

// LOGIN
router.get('/login', (req, res) => {
  const uid = req.cookies['user_id'];
  // console.log('uid: ', uid);
  // console.log('db.users[uid]: ', db.users[uid]);
  const templateVars = {
    user: db.users[uid]
  };
  res.render('login', templateVars);
});

router.post('/login', (req, res) => {
  const uid = util.getUIDFromEmail(req.body.email);
  // Verify user account exists
  if (!uid) {
    return res.status(400).send('Invalid email');
  }
  // Verify password is valid
  if (db.users[uid].password !== req.body.password) {
    return res.status(400).send('Invalid password');
  }
  res.cookie('user_id', uid);
  res.redirect('/urls');
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

// REGISTER
router.get('/register', (req, res) => {
  const uid = req.cookies['user_id'];
  const templateVars = {
    user: db.users[uid]  
  }
  res.render('register', templateVars);
});

router.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send('Email or Password cannot be empty');
  }

  if (util.getUIDFromEmail(req.body.email)) {
    return res.status(400).send('Email already taken');
  }

  const uid = util.generateRandomString();
  db.users[uid] = {
    id: uid,
    email: req.body.email,
    password: req.body.password
  };
  console.log(db.users);
  res.cookie('user_id', uid);
  res.redirect('/urls');
});

// CATCH-ALL
router.get('*', (req, res) => {
  res.redirect('/urls');
});

module.exports = router;