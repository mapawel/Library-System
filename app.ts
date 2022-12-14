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

const library = Library.getLibrary();
const r1 = library.addBook(b1);
const r2 = library.addBook(b2);
const book1uuid = r1?.book.uuid;
const book2uuid = r2?.book.uuid;

const users = UserStore.getInstance();
const ru1 = users.addUser({ pesel: 123, firstName: 'Pawel', lastName: 'Em' });
const ru2 = users.addUser({ pesel: 456, firstName: 'Piotr', lastName: 'Em' });
const user1pesel = ru1?.pesel;
const user2pesel = ru2?.pesel;

const system = BookingSystem.getBookingSystem();

system.bookBook({
  bookUuid: book1uuid as string,
  userPesel: user1pesel as number,
  bookingDays: 6,
});



system.bookBook({
  bookUuid: book2uuid as string,
  userPesel: user1pesel as number,
  bookingDays: 5,
});


system.returnBook({
  bookUuid: book1uuid as string,
  userPesel: user1pesel as number,
});

system.returnBook({
  bookUuid: book2uuid as string,
  userPesel: user1pesel as number,
});

system.bookBook({
  bookUuid: book2uuid as string,
  userPesel: user1pesel as number,
  bookingDays: 5,
});


console.log('bookings ----> ', system.getBookings());
console.log('library ----> ', library.getBooks());

// console.log('petalty ----> ', system.calculatePenalty(123));
console.log(' ----> ', users.getUserByPesel(123));
