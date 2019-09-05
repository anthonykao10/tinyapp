const router = require("express").Router();
const bcrypt = require('bcrypt');
const db = require('../models/database');
const { generateRandomString, getUserByEmail } = require('../helpers');

// LOGIN
router.get('/login', (req, res) => {
  const uid = req.session.user_id;
  const templateVars = {
    user: db.users[uid]
  };
  res.render('login', templateVars);
});

router.post('/login', (req, res) => {
  const user = getUserByEmail(req.body.email, db.users);
  // Verify user account exists
  if (!user) {
    return res.status(400).send('Invalid email');
  }
  // Verify password is valid
  const password = req.body.password;
  if (!bcrypt.compareSync(password, db.users[user.id].password)) {
    return res.status(400).send('Invalid password');
  }
  req.session.user_id = user.id;
  res.redirect('/urls');
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

// REGISTER
router.get('/register', (req, res) => {
  const uid = req.session.user_id;
  const templateVars = {
    user: db.users[uid]  
  }
  res.render('register', templateVars);
});

router.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send('Email or Password cannot be empty');
  }

  if (getUserByEmail(req.body.email, db.users)) {
    return res.status(400).send('Email already taken');
  }

  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const uid = generateRandomString();
  db.users[uid] = {
    id: uid,
    email: req.body.email,
    password: hashedPassword
  };
  req.session.user_id = uid;
  res.redirect('/urls');
});

// CATCH-ALL
router.get('*', (req, res) => {
  res.redirect('/urls');
});

module.exports = router;