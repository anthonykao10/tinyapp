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
  // Handle conflicts when generating strings
  let shortURL = util.generateRandomString();
  while (db.urlDatabase[shortURL]) {
    shortURL = util.generateRandomString();
  }
  db.urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// NEW
router.get('/new', (req, res) => {
  const uid = req.cookies['user_id'];
  let templateVars = {
    user: db.users[uid]
  }
  res.render('urls_new', templateVars);
});

// SHOW
router.get('/:shortURL', (req, res) => {
  const uid = req.cookies['user_id'];
  let templateVars = { 
    longURL: db.urlDatabase[req.params.shortURL],
    shortURL: req.params.shortURL,
    user: db.users[uid]
  };
  res.render('urls_show', templateVars);
});

// EDIT
router.post('/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL;
  let newLongURL = req.body.longURL;
  db.urlDatabase[shortURL] = newLongURL;
  res.redirect(`/${shortURL}`);
});

// DELETE
router.post('/:shortURL/delete', (req, res) => {
  let url = req.params.shortURL;
  delete db.urlDatabase[url];
  res.redirect('back');
});

module.exports = router;