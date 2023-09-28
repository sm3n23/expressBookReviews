const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  
  const bookList = Object.values(books);

  const formattedBookList = JSON.stringify(bookList, null, 2);

  return res.status(200).json({ books: formattedBookList });
});



/* async function getBookList() {
  try {
    // Replace 'YOUR_API_ENDPOINT' with the actual URL where your API is running
    const response = await axios.get('http://localhost:5000');

    if (response.status === 200) {
      // Successful response, return the book list
      return response.data.books;
    } else {
      // Handle any other status codes or errors
      throw new Error('Failed to fetch book list');
    }
  } catch (error) {
    // Handle network errors or other exceptions
    console.error('Error:', error.message);
    throw error;
  }
}

// Usage
(async () => {
  try {
    const bookList = await getBookList();
    console.log('Book List:', bookList);
  } catch (error) {
    // Handle errors
  }
})(); */


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Retrieve the ISBN from the request parameters
  const requestedISBN = req.params.isbn;

  // Check if the requested ISBN exists in the books object
  if (books[requestedISBN]) {
    // If the ISBN exists, return the book details
    const bookDetails = books[requestedISBN];
    return res.status(200).json(bookDetails);
  } else {
    // If the ISBN doesn't exist, return a not found response
    return res.status(404).json({ message: "Book not found" });
  }
});


async function getBookDetailsByISBN(isbn) {
  try {
    // Replace 'YOUR_API_ENDPOINT' with the actual URL where your API is running
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

    if (response.status === 200) {
      // Successful response, return the book details
      return response.data;
    } else if (response.status === 404) {
      // Handle the case where the book is not found
      throw new Error('Book not found');
    } else {
      // Handle any other status codes or errors
      throw new Error('Failed to fetch book details');
    }
  } catch (error) {
    // Handle network errors or other exceptions
    console.error('Error:', error.message);
    throw error;
  }
}

// Usage
(async () => {
  try {
    const isbn = '1'; // Replace with the ISBN of the book you want to retrieve
    const bookDetails = await getBookDetailsByISBN(isbn);
    console.log('Book Details:', bookDetails);
  } catch (error) {
    // Handle errors
  }
})();


  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // Retrieve the author from the request parameters
  const requestedAuthor = req.params.author;

  // Initialize an array to store matching books
  const matchingBooks = [];

  // Iterate through the 'books' object to find books with the specified author
  for (const isbn in books) {
    if (books[isbn].author === requestedAuthor) {
      matchingBooks.push(books[isbn]);
    }
  }

  if (matchingBooks.length > 0) {
    // If matching books are found, return them as a JSON response
    return res.status(200).json(matchingBooks);
  } else {
    // If no books by the specified author are found, return a not found response
    return res.status(404).json({ message: "No books by this author found" });
  }
});




async function getBooksByAuthor(author) {
  try {
    // Replace 'YOUR_API_ENDPOINT' with the actual URL where your API is running
    const response = await axios.get(`http://localhost:5000/author/${author}`);

    if (response.status === 200) {
      // Successful response, return the list of books by the author
      return response.data;
    } else if (response.status === 404) {
      // Handle the case where no books by the author are found
      throw new Error('No books by this author found');
    } else {
      // Handle any other status codes or errors
      throw new Error('Failed to fetch books by author');
    }
  } catch (error) {
    // Handle network errors or other exceptions
    console.error('Error:', error.message);
    throw error;
  }
}

// Usage
(async () => {
  try {
    const author = 'Chinua Achebe'; // Replace with the name of the author you want to search for
    const booksByAuthor = await getBooksByAuthor(author);
    console.log('Books by Author:', booksByAuthor);
  } catch (error) {
    // Handle errors
  }
})();



// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // Retrieve the title from the request parameters
  const requestedTitle = req.params.title;

  // Initialize an array to store matching books
  const matchingBooks = [];

  // Iterate through the 'books' object to find books with the specified title
  for (const isbn in books) {
    if (books[isbn].title === requestedTitle) {
      matchingBooks.push(books[isbn]);
    }
  }

  if (matchingBooks.length > 0) {
    // If matching books are found, return them as a JSON response
    return res.status(200).json(matchingBooks);
  } else {
    // If no books with the specified title are found, return a not found response
    return res.status(404).json({ message: "No books with this title found" });
  }
});




async function getBooksByTitle(title) {
  try {
    // Replace 'YOUR_API_ENDPOINT' with the actual URL where your API is running
    const response = await axios.get(`http://localhost:5000/title/${title}`);

    if (response.status === 200) {
      // Successful response, return the list of books with the matching title
      return response.data;
    } else if (response.status === 404) {
      // Handle the case where no books with the title are found
      throw new Error('No books with this title found');
    } else {
      // Handle any other status codes or errors
      throw new Error('Failed to fetch books by title');
    }
  } catch (error) {
    // Handle network errors or other exceptions
    console.error('Error:', error.message);
    throw error;
  }
}

// Usage
(async () => {
  try {
    const title = 'Things Fall Apart'; // Replace with the title of the book you want to search for
    const booksByTitle = await getBooksByTitle(title);
    console.log('Books by Title:', booksByTitle);
  } catch (error) {
    // Handle errors
  }
})();



//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  // Retrieve the ISBN from the request parameters
  const requestedISBN = req.params.isbn;

  // Check if the requested ISBN exists in the 'books' object
  if (books[requestedISBN]) {
    // Check if there are any reviews for the book
    const bookReviews = books[requestedISBN].reviews;

    if (Object.keys(bookReviews).length > 0) {
      // If reviews exist, return them as a JSON response
      return res.status(200).json({ reviews: bookReviews });
    } else {
      // If no reviews are found, return a message indicating that there are no reviews
      return res.status(200).json({ message: "No reviews for this book yet" });
    }
  } else {
    // If the ISBN doesn't exist, return a not found response
    return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.general = public_users;
