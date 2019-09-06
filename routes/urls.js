const router = require("express").Router();
const { urlDatabase, usersDatabase } = require('../database');
const { getURLsForUser, generateRandomString } = require('../helpers');

// INDEX
router.get('/', (req, res) => {
  const uid = req.session.user_id;
  // Verify user is authenticated
  if (!uid) return res.redirect('login');

  const currUserURLs = getURLsForUser(uid, urlDatabase);
  let templateVars = {
    urls: currUserURLs,
    user: usersDatabase[uid],
    page: 'index'
  };
  res.render('urls_index', templateVars);
});

// CREATE
router.post('/', (req, res) => {
  // Only allow authenticated requests
  if (!req.session.user_id) return res.sendStatus(400);
  let shortURL = generateRandomString();
  // Handle conflicts when generating short URL's
  while (urlDatabase[shortURL]) {
    shortURL = generateRandomString();
  }
  // Create new URL object
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
    totalVisits: 0,
    uniqueVisits: 0,
    visitors: {},
    visits: {}
  };
  res.redirect(`/urls/${shortURL}`);
});

// NEW
router.get('/new', (req, res) => {
  const uid = req.session.user_id;
  // Verify user is authenticated
  if (!uid) return res.redirect('/login');
  const templateVars = {
    user: usersDatabase[uid],
    page: 'new'
  };
  res.render('urls_new', templateVars);
});

// SHOW
router.get('/:shortURL', (req, res) => {
  const uid = req.session.user_id;
  // Verify user is authenticated
  if (!uid) return res.redirect('/login');

  const shortURL = req.params.shortURL;
  const urlObj = urlDatabase[shortURL];
  const longURL = urlObj.longURL;
  const totalVisits = urlObj.totalVisits;
  const uniqueVisits = urlObj.uniqueVisits;
  const visitors = urlObj.visitors;
  const visits = urlObj.visits;
  const templateVars = {
    longURL,
    shortURL,
    totalVisits,
    visitors,
    uniqueVisits,
    visits,
    user: usersDatabase[uid],
    page: 'show'
  };
  res.render('urls_show', templateVars);
});

// EDIT
router.put('/:shortURL', (req, res) => {
  // Only allow authenticated requests
  if (!req.session.user_id) return res.sendStatus(400);

  const shortURL = req.params.shortURL;
  const newLongURL = req.body.longURL;
  const currUser = req.session.user_id;
  // Only authorize users to edit URLs they created
  if (currUser !== urlDatabase[shortURL].userID) {
    return res.status(400).send('Unauthorized action');
  }
  urlDatabase[shortURL].longURL = newLongURL;
  res.redirect(`/${shortURL}`);
});

// DELETE
router.delete('/:shortURL', (req, res) => {
  // Only allow authenticated requests
  if (!req.session.user_id) return res.sendStatus(400);

  const shortURL = req.params.shortURL;
  const currUser = req.session.user_id;
  // Only authorize users to delete URLs they created
  if (currUser !== urlDatabase[shortURL].userID) {
    return res.status(400).send('Unauthorized action');
  }
  delete urlDatabase[shortURL];
  res.redirect('back');
});

module.exports = router;