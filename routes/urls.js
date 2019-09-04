const router = require("express").Router();
const db = require('../models/database');
const util = require('../helpers');

// INDEX
router.get('/', (req, res) => {
  const uid = req.cookies['user_id'];
  if (!uid) {
    return res.redirect('login');
  }
  const currUserURLs = util.urlsForUser(uid);
  // console.log('userURLs: ', currUserURLs);
  
  let templateVars = {
    urls: currUserURLs,
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
  // Verify user is authenticated
  if (!uid) return res.redirect('/login');
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
  const currUser = req.cookies['user_id'];
  // Only authorize users to edit URLs they created
  if (currUser !== db.urlDatabase[shortURL].userID) {
    return res.status(400).send('Unauthorized action');
  }
  db.urlDatabase[shortURL].longURL = newLongURL;
  res.redirect(`/${shortURL}`);
});

// DELETE
router.post('/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  const currUser = req.cookies['user_id'];
  // Only authorize users to delete URLs they created
  if (currUser !== db.urlDatabase[shortURL].userID) {
    return res.status(400).send('Unauthorized action');
  }
  delete db.urlDatabase[shortURL];
  res.redirect('back');
});

module.exports = router;