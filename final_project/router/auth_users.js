const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const JWT_SECRET = "itsASecret";

let users = [];

const isValid = (username)=>{
  return users.filter( user => user.username === username).length === 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some( user => user.username === username && user.password === password);
}
//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.query.username;
  let password = req.query.password;
  if(!username || !password){
    return res.status(401).json({message: "Missing login information"
        });
    }
  if(!authenticatedUser(username, password)){
    return res.status(403).json({message: "Wrong info loggin"
        });
    }
  let accessToken = jwt.sign({
    data: password
    }, 'access',
    { expiresIn: 60 * 60
    });

  req.session.authorization = {
    accessToken,username
    }
  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let review = req.query.review;
    let isbn = req.params.isbn;
    let book = books[isbn];
    let username = req.session.authorization.username;
    book.reviews[username] = review;
    return res.status(200).send("New review added.");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let book = books[isbn];
    let username = req.session.authorization.username;
    book.reviews = Object.keys(book.reviews)
    .filter((key) => key !== username)
    .reduce((obj, key) => {
        return Object.assign(obj, {
          [key]: user[key]
        });
  }, {});
  return res.status(200).send("Review deleted.");

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
