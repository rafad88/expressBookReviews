const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.query.username;
  let password = req.query.password;
  if(!username || !password){
    return res.status(401).json({message: "Missing login information"});
  }
  if(!isValid(username)){
    return res.status(403).json({message: "User already registered"});
  }
  users.push({username:username, password: password});
  return res.send("New user: " + username);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return new Promise(function(resolve, reject) {
        resolve(JSON.stringify(Object.values(books)))
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    return new Promise(function(resolve, reject) {
        let isbn = req.params.isbn;
        let book = books[isbn];
        resolve(JSON.stringify(book));
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    return new Promise(function(resolve, reject) {
        let author = req.params.author;
        let booksArray = Object.values(books);
        let booksByAuthor = booksArray.filter( book => book.author === author );
        resolve(JSON.stringify(Object.values(booksByAuthor)));
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    return new Promise(function(resolve, reject) {        
        let title = req.params.title;
        let booksArray = Object.values(books);
        let booksByTitle = booksArray.filter( book => book.title === title );
        resolve(JSON.stringify(Object.values(booksByTitle)));
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    return res.send(book.reviews);
});

module.exports.general = public_users;
