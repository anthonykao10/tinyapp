const express = require("express");
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const urlRoutes = require('./routes/urls');
const authRoutes = require('./routes/auth');
const db = require('./models/database');
const PORT = 8080;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['supersecretkey']
}));

// HOMEPAGE
app.get("/", (req, res) => {
  res.send("homepage");
});

// REDIRECT ENDPOINT (shortURL => longURL)
app.get('/u/:shortURL', (req, res) => {
  let longURL = db.urlDatabase[req.params.shortURL].longURL;
  // Handle invalid shortURL
  if (!longURL) return res.redirect('/urls');
  // Check longURL for http protocol 
  if (longURL.slice(0, 4) !== 'http') {
    longURL = 'http://' + longURL;
  }
  res.redirect(longURL);
});

// Returns URLs json data
app.get("/urls.json", (req, res) => {
  res.json(db.urlDatabase);
});

// Returns Users json data
app.get("/users.json", (req, res) => {
  res.json(db.users);
});

app.use('/urls', urlRoutes);
app.use('/', authRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});