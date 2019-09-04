const router = require("express").Router();
const db = require('../models/database');
const util = require('../helpers');

// INDEX
router.get('/', (req, res) => {
  const uid = req.cookies['user_id'];
  let templateVars = {
    urls: db.urlDatabase,
    user: db.users[uid]
   };
  res.render('urls_index', templateVars);
});

// CREATE
router.post('/', (req, res) => {
  const shortURL = util.generateRandomString();
  // Handle conflicts when generating short URL's
  while (db.urlDatabase[shortURL]) {
    shortURL = util.generateRandomString();
  }
  // Create new URL object
  db.urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies['user_id']
  }
  res.redirect(`/urls/${shortURL}`);
});

// NEW
router.get('/new', (req, res) => {
  const uid = req.cookies['user_id'];
  // Verify user is authenticated
  if (!uid) return res.redirect('/login');
  const templateVars = {
    user: db.users[uid]
  }
  res.render('urls_new', templateVars);
});

// SHOW
router.get('/:shortURL', (req, res) => {
  const uid = req.cookies['user_id'];
  debugger;
  const templateVars = { 
    longURL: db.urlDatabase[req.params.shortURL].longURL,
    shortURL: req.params.shortURL,
    user: db.users[uid]
  };
  res.render('urls_show', templateVars);
});

// EDIT
router.post('/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const newLongURL = req.body.longURL;
  // console.log('shortURL: ', shortURL);
  // console.log('db.urlDatabase[shortURL]: ', db.urlDatabase[shortURL]);
  db.urlDatabase[shortURL].longURL = newLongURL;
  res.redirect(`/${shortURL}`);
});

// DELETE
router.post('/:shortURL/delete', (req, res) => {
  const url = req.params.shortURL;
  delete db.urlDatabase[url];
  res.redirect('back');
});

module.exports = router;