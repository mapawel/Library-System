import { BookStore } from './Books/Book-store/Book.store.js';
import { Book } from './Books/Book/Book.class.js';
import { UserStore } from './Users/User-store/User.store.js';
import { User } from './Users/User/User.class.js';
import { Library } from './Library/Library.js';
// TODO jak zmienić importy aby skorzystać ze ścieżki bazowej i bez .js?

// adding some test books
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

// initializing bookStore and adding books to bookStore
const bookStore = BookStore.getInstance();
const r1 = bookStore.addBook(b1);
const r2 = bookStore.addBook(b2);
const book1uuid = r1?.book.uuid;
const book2uuid = r2?.book.uuid;

// initializing users store and adding some test users
const users = UserStore.getInstance();
const ru1 = users.addUser({ pesel: 123, firstName: 'Pawel', lastName: 'Em' });
const ru2 = users.addUser({ pesel: 456, firstName: 'Piotr', lastName: 'Em' });
const user1pesel = ru1?.pesel;

//initializing BOOKING SYSTEM
const library = Library.getInstance();

// SOME TEST OPERATIONS ON BOOKINGS
// library.bookBook({
//   bookUuid: book1uuid as string,
//   userPesel: user1pesel as number,
//   bookingDays: 6,
// });

// library.bookBook({
//   bookUuid: book2uuid as string,
//   userPesel: user1pesel as number,
//   bookingDays: 5,
// });

// library.returnBook({
//   bookUuid: book1uuid as string,
//   userPesel: user1pesel as number,
// });

library.returnBook({
  bookUuid: book2uuid as string,
  userPesel: user1pesel as number,
});

// library.bookBook({
//   bookUuid: book2uuid as string,
//   userPesel: user1pesel as number,
//   bookingDays: 5,
// });

console.log('USER WITH BOOKS ----> ', users.getUserByPesel(123));
