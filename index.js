const express = require("express")
//database
const database = require("./database");

var bodyParser = require("body-parser");

//initialize express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());
 
//get all the books
booky.get("/", (req,res) => {
     return res.json({books: database.books});
} );

//get a specific book
booky.get("/is/:isbn", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );
    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
    }

     return res.json({books: getSpecificBook});
} );

//get all the books for similar category
booky.get("/c/:category", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );
    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the cataegory of ${req.params.category}`});
    }
    return res.json({books: getSpecificBook});
} );

//speific language
booky.get("/lang/:language", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language === req.params.language
    );
    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the language of ${req.params.language}`});
    }

     return res.json({books: getSpecificBook});
} );

//get all authors
booky.get("/author", (req,res) => {
    return res.json({authors: database.author})
})


//get authors based on books
booky.get("/author/book/:isbn", (req,res) => {

    const getSpecificAuthor = database.author.filter(
        (author) =>author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length === 0){
       return res.json({error: `No author found of the book of ${req.params.isbn}`});
    }
    return res.json({authors: getSpecificAuthor});
});

//get all publications
booky.get("/publications", (req,res) => {
    return res.json({publication: database.publication})
})


//........POST..........//
booky.post("/book/new", (req,res) => {
    
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});

});

booky.post("/author/new", (req,res) => {
    
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json(database.author);

});

booky.post("/publications/new", (req,res) => {
    
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json(database.publication);

});


//.........PUT..............//
booky.put("/publications/update/book/:isbn", (req,res) => {
    //update the publication database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId){
            return pub.books.push(req.params.isbn);
        }
    });

    //update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publication = req.body.pubId;
            return;
        }
    });

    return res.json({
        books: database.books,
        publication: database.publication,
        message: "Successfully updated publications"
    })

});

//.....DELETE........//
booky.delete("/book/delete/:isbn" , (req, res) => {
  //whichever book that does not match with the isbn, just send it to an updatedBookDatabse array
  //and rest will be filtered out

  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  )
  database.books = updatedBookDatabase;

  return res.json({books: database.books});
});


booky.delete("/book/delete/author/:isbn/:authorId" , (req, res) => {
  
   //update the book databse
   database.books.forEach((book) =>{
      if(book.ISBN === req.params.isbn){
        const newAuthorList = book.author.filter(
            (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
        );
        book.author = newAuthorList;
        return;
      }
   });
       //update the author database
    database.author.forEach((eachAuthor) => {
       if(eachAuthor.id === parseInt(req.params.authorId)){
        const newBookList = eachAuthor.books.filter(
            (Book) => Book !== req.params.isbn
        );
           eachAuthor.books = newBookList;
       }
    });
    return res.json(
        {books: database.books,
         author: database.author,
         message: "author was deleted!!"
         });
  });


booky.listen(3002,() => {
    console.log("server is up and running");
});