# Library System (backend)

### Description:
- Typescript project (no framework used), Object Oriented Programming.
- Simple abstraction of a library/book rental system.
- The application operates on an in-memory DB (no real DB has been implemented at this stage).
- Basic unit tests using Chai/Mocha.

##### Completed tasks:
- A client can borrow more than one book from the library.
- Implementation of adding and removing books from the list of borrowed books.
- A return function with the calculation of any penalties: if the return is made on time, no penalty will be charged, but if it's not, penalty points will be charged for each day of delay. If the penalty reaches 10 points, the user cannot borrow a book for a month, but after that, the points are reset.
- Implementation of book operations: adding books to the list, removing books from the list, borrowing books for a specific user, returning borrowed books.
