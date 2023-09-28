const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}





//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Retrieve the ISBN and review text from the request query
  const requestedISBN = req.params.isbn;
  const reviewText = req.query.review;

  // Check if the user is logged in (i.e., if there's a username stored in the session)
  if (req.session.authorization && req.session.authorization.username) {
    const username = req.session.authorization.username;

    // Check if the book with the specified ISBN exists in your book database
    if (books[requestedISBN]) {
      const book = books[requestedISBN];

      // Check if the user has already posted a review for this book
      if (book.reviews[username]) {
        // User has already posted a review, modify the existing review
        book.reviews[username] = reviewText;
      } else {
        // User has not posted a review before, add a new review
        book.reviews[username] = reviewText;
      }

      return res.status(200).json({ message: "Review added/modified successfully" });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } else {
    return res.status(401).json({ message: "User not logged in" });
  }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Retrieve the ISBN from the request parameters
  const requestedISBN = req.params.isbn;

  // Check if the user is logged in (i.e., if there's a username stored in the session)
  if (req.session.authorization && req.session.authorization.username) {
    const username = req.session.authorization.username;

    // Check if the book with the specified ISBN exists in your book database
    if (books[requestedISBN]) {
      const book = books[requestedISBN];

      // Check if the user has posted a review for this book
      if (book.reviews[username]) {
        // Delete the user's review
        delete book.reviews[username];

        return res.status(200).json({ message: "Review deleted successfully" });
      } else {
        return res.status(200).json({ message: "Review deleted successfully" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } else {
    return res.status(401).json({ message: "User not logged in" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
