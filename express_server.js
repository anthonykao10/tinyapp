const express = require("express");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const urlRoutes = require('./routes/urls');
const authRoutes = require('./routes/auth');
const { urlDatabase, usersDatabase } = require('./database');
const PORT = 8080;

const app = express();
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['supersecretkey']
}));

// HOMEPAGE
app.get("/", (req, res) => {
  if (req.session.user_id) {
    return res.redirect('/urls');
  }
  res.redirect('/login');
});

// REDIRECT ENDPOINT (shortURL => longURL)
app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
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
  res.json(urlDatabase);
});

// Returns Users json data
app.get("/users.json", (req, res) => {
  res.json(usersDatabase);
});

app.use('/urls', urlRoutes);
app.use('/', authRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});