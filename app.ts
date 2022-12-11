import { Library } from './Library/Library.js';
import { Book } from './Book/Book.js';
import { UserStore } from './Users/UserStore/UserStore.js';
import { User } from './Users/User.js';
import { BookingSystem } from './BookingSystem/BookingSystem.js';
// TODO jak zmienić importy aby skorzystać ze ścieżki bazowej i bez .js?

const b1 = new Book({
  title: 'tytuł',
  author: 'autor',
  year: 2000,
  publisher: 'wydawca',
});

const b2 = new Book({
  title: 'tytuł2',
  author: 'autor2',
  year: 2002,
  publisher: 'wydawca2',
});

const library = Library.getLibrary()
const r1 = library.addBook(b1)
const r2 = library.addBook(b2)
// console.log('r1 ----> ', r1);
// console.log('r2 ----> ', r2);
// console.log('library.books ----> ', library.getBooks());


// const u1 = new User({pesel: 123, firstName: 'Pawel', lastName: 'Em'})
// const u2 = new User({pesel: 456, firstName: 'Piotr', lastName: 'Em'})

// const users = UserStore.getInstance()
// const ru1 = users.addUser(u1)
// const ru2 = users.addUser(u2)
// console.log('ru1 ----> ', ru1);
// console.log('ru2 ----> ', ru2);

const system = BookingSystem.getBookingSystem()
