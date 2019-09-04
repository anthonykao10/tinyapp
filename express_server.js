const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = 8080;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

/* HELPERS */
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

function getUIDFromEmail(email) {
  for (uid in users) {
    if (users[uid].email === email) return uid;
  }
  return false;
}

/* DATA */
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
  const uid = req.cookies['user_id'];
  let templateVars = {
    urls: urlDatabase,
    user: users[uid]
   };
  res.render('urls_index', templateVars);
});

/* NEW */
app.get('/urls/new', (req, res) => {
  const uid = req.cookies['user_id'];
  let templateVars = {
    user: users[uid]
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
  const uid = req.cookies['user_id'];
  let templateVars = { 
    longURL: urlDatabase[req.params.shortURL],
    shortURL: req.params.shortURL,
    user: users[uid]
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
app.get('/login', (req, res) => {
  const uid = req.cookies['user_id'];
  let templateVars = {
    user: users[uid]
  }
  res.render('urls_login', templateVars);
});

app.post('/login', (req, res) => {
  const uid = getUIDFromEmail(req.body.email);
  res.cookie('user_id', uid);
  console.log(uid);
  console.log(req.body);
  console.log(req.body.email);
  res.redirect('/urls');
});

/* LOGOUT */
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

/* REGISTER */
app.get('/register', (req, res) => {
  const uid = req.cookies['user_id'];
  let templateVars = {
    user: users[uid]  
  }
  res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send('Email or Password cannot be empty');
  }

  if (getUIDFromEmail(req.body.email)) {
    return res.status(400).send('Email already taken');
  }

  const uid = generateRandomString();
  users[uid] = {
    id: uid,
    email: req.body.email,
    password: req.body.password
  };
  console.log(users);
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