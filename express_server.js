const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = 8080;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Return a string of 6 random alpha-numeric char's
function generateRandomString() {
  const values = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let output = '';
  for (let i = 0; i < 6; i++) {
    let randomIdx = Math.floor((Math.random() * 61) + 1);
    output += values[randomIdx];
  }
  return output;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

/* HOME */
app.get("/", (req, res) => {
  res.send("homepage");
});

/* INDEX */
app.get('/urls', (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    username: req.cookies['username']
   };
  res.render('urls_index', templateVars);
});

/* NEW */
app.get('/urls/new', (req, res) => {
  let templateVars = {
    username: req.cookies['username']
  }
  res.render('urls_new', templateVars);
});

/* CREATE */
app.post('/urls', (req, res) => {
  // Handle conflicts when generating strings
  let shortURL = generateRandomString();
  while (urlDatabase[shortURL]) {
    shortURL = generateRandomString();
  }
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

/* SHOW */
app.get('/urls/:shortURL', (req, res) => {
  let templateVars = { 
    longURL: urlDatabase[req.params.shortURL],
    shortURL: req.params.shortURL,
    username: req.cookies['username']
  };
  res.render('urls_show', templateVars);
});

/* EDIT */
app.post('/urls/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL;
  let newLongURL = req.body.longURL;
  urlDatabase[shortURL] = newLongURL;
  res.redirect(`/urls/${shortURL}`);
});

/* DELETE */
app.post('/urls/:shortURL/delete', (req, res) => {
  let url = req.params.shortURL;
  delete urlDatabase[url];
  res.redirect('back');
});

/* REDIRECT ENDPOINT (shortURL => longURL) */
app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  // Handle invalid shortURL
  if (longURL === undefined) return res.redirect('/urls');
  // Check longURL for http protocol 
  if (longURL.slice(0, 4) !== 'http') {
    longURL = 'http://' + longURL;
  }
  res.redirect(longURL);
});

/* LOGIN */
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

/* LOGOUT */
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

/* REGISTER */
app.get('/register', (req, res) => {
  let templateVars = {
    username: req.cookies['username']
  }
  res.render('urls_register', templateVars);
});

/* REGISTRATION HANDLER */
app.post('/register', (req, res) => {
  const uid = generateRandomString();
  users[uid] = {
    id: uid,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie('user_id', uid);
  res.redirect('/urls');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get('*', (req, res) => {
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});