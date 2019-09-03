const express = require("express");
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

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
// app.post('/urls', (req, res) => {

// });

// SHOW
app.get('/urls/:shortURL', (req, res) => {
  let templateVars = { 
    longURL: urlDatabase[req.params.shortURL],
    shortURL: req.params.shortURL
  };
  res.render('urls_show', templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});