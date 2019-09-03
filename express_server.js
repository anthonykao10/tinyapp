const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// Return a string of 6 random alpha-numeric char's (only lowercase)
function generateRandomString() {
  return ((Math.random() + 1) * parseInt(100000, 36)).toString(36).slice(0, 6);
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// HOME
app.get("/", (req, res) => {
  res.send("Hello!");
});

// INDEX
app.get('/urls', (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// NEW
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

// CREATE
app.post('/urls', (req, res) => {
  let shortURL = generateRandomString();
  console.log(req.body.longURL);
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

// SHOW
app.get('/urls/:shortURL', (req, res) => {
  let templateVars = { 
    longURL: urlDatabase[req.params.shortURL],
    shortURL: req.params.shortURL
  };
  res.render('urls_show', templateVars);
});

// Redirect shortURL to corresponding longURL
app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// JSON DATA
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});