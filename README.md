# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["urls landing page"](https://github.com/anthonykao10/tinyapp/blob/master/docs/urls-index.png?raw=true)
!["screenshot description"](https://github.com/anthonykao10/tinyapp/blob/master/docs/edit.png?raw=true)

## Dependencies

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [EJS](https://ejs.co/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [body-parser](https://github.com/expressjs/body-parser)
- [cookie-session](https://github.com/expressjs/cookie-session)
- [method-override](https://github.com/expressjs/method-override)

## Getting Started

- Clone the repo.
- Move to the root directory of the project.
```
$ cd tinyapp
```
- Install dependencies.
```
$ npm install
```
- Run the development web server.
```
$ node express_server.js
```

## Tests
Helper functions tested with the following tools:
  - [Mocha](https://mochajs.org/)
  - [Chai](https://www.chaijs.com/)

To run (with both Mocha and Chai installed): 
```
$ npm test
```
runs the following command: `./node_modules/mocha/bin/mocha`.


## Features/ Page Descriptions
- Authentication/authorization using `bcrypt` and `cookie-session`.
- `/urls` page:
  - Shortened URLs saved for the authenticated user
- `/urls/:id` page:
  - Form for editing the selected URL.
  - Tracks the total number of times a link has been visted.
  - Tracks the number of unique visits per link (*currently only tracks unique visits from registered users*).
  - Lists every visit to the URL (visitor ID and timestamp).
- `/urls/new` page:
  - Form for submitting a new url to be shortened.

## Notes
- This is a project created for learning purposes as part of the Web Development program at [Lighthouse Labs](https://www.lighthouselabs.ca/web-bootcamp).
- No database is used. All data is transiently saved in memory.