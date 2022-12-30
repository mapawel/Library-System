import { assert } from 'chai';
import { LibraryItem } from '../../Library/LibraryItem.type';
import { User } from '../../Users/User.class';
import { UserStore } from '../../Users/User-store/User-store.class';
import { BookingService } from '../Booking-service.class';
import { Library } from '../../Library/Library.class';
import { bookMock } from './book.mock';
import { book2Mock } from './book2.mock';
import { userMock } from './user.mock';
import { user2Mock } from './user2.mock';
import { Booking } from 'Booking-service/Booking.class';
import { set, reset } from 'mockdate';
import { daysToMillis } from '../../utils/daysToMillis';

describe('Booking-service tests suite:', () => {
  let bookingService: BookingService;
  let library: Library;
  let userStore: UserStore;
  let libraryItem: LibraryItem;
  let libraryItem2: LibraryItem;
  let user: User;
  let user2: User;
  let date: number;

  beforeEach(() => {
    bookingService = BookingService.getInstance();
    library = Library.getInstance();
    userStore = UserStore.getInstance();
    user = userStore.addUser(userMock);
    user2 = userStore.addUser(user2Mock);
    libraryItem = library.addBook(bookMock);
    libraryItem2 = library.addBook(book2Mock);
    date = Date.now();
    set(date);
  });

  afterEach(() => {
    BookingService.resetInstance();
    Library.resetInstance();
    UserStore.resetInstance();
    reset();
  });

  describe('bookBook() tests:', () => {
    it('should connect the library item with user, create a new booking and save this booking in array of bookings at key of user pesel', () => {
      bookingService.bookBook({
        bookUuid: libraryItem.book.uuid,
        userPesel: user.pesel,
        bookingDays: 14,
      });

      const updatedLibraryItem = library.getItemById(libraryItem.book.uuid);
      assert.deepEqual(updatedLibraryItem.user, user);

      const bookings: Map<number, Booking[]> = bookingService.getBookings();
      const expectedBooking = bookings.get(user.pesel);
      assert.equal(expectedBooking?.[0].book, libraryItem.book);
    });

    it('should throw error due to checkIfCanBook() validation while booking', () => {
      user.setPenalty(10);

      assert.throws(() => {
        bookingService.bookBook({
          bookUuid: libraryItem.book.uuid,
          userPesel: user.pesel,
          bookingDays: 14,
        });
      }, 'Passed user cannot book a book, is blocked! Cannon proceed.');
    });

    it('should throw error on try to book an already booked book', () => {
      bookingService.bookBook({
        bookUuid: libraryItem.book.uuid,
        userPesel: user.pesel,
        bookingDays: 14,
      });
      assert.throws(() => {
        bookingService.bookBook({
          bookUuid: libraryItem.book.uuid,
          userPesel: user.pesel,
          bookingDays: 14,
        });
      }, 'Passed book uuid points on the already booked book! Cannot proceed.');
    });

    it('should throw error on try to book if the already booked books for user generate penalty > 10', () => {
      const bookingDays: number = 7;
      bookingService.bookBook({
        bookUuid: libraryItem.book.uuid,
        userPesel: user.pesel,
        bookingDays,
      });
      date += daysToMillis(bookingDays + 10);
      set(date);
      assert.throws(() => {
        bookingService.bookBook({
          bookUuid: libraryItem2.book.uuid,
          userPesel: user.pesel,
          bookingDays: 14,
        });
      }, 'User is holding books too long and cannot book another one! User should return all books and weit for reset petalty.');
    });
  });

  describe('returnBook() tests:', () => {
    it('should remove booking from user bookings and not add a penalty due to returnement in time', () => {
      const bookingDays: number = 7;
      bookingService.bookBook({
        bookUuid: libraryItem.book.uuid,
        userPesel: user.pesel,
        bookingDays,
      });
      date += daysToMillis(bookingDays);
      set(date);
      bookingService.returnBook({
        bookUuid: libraryItem.book.uuid,
        userPesel: user.pesel,
      });
      const bookings = bookingService.getBookings();
      const userBooking = bookings.get(user.pesel);
      assert.isEmpty(userBooking);

      const updatedUser = userStore.getUserByPesel(user.pesel);
      assert.equal(updatedUser.checkUserCurrentPenalty(user), 0);
    });

    it('should remove booking from user bookings and add a penalty = 10', () => {
      const bookingDays: number = 7;
      bookingService.bookBook({
        bookUuid: libraryItem.book.uuid,
        userPesel: user.pesel,
        bookingDays,
      });
      date += daysToMillis(bookingDays + 10);
      set(date);
      bookingService.returnBook({
        bookUuid: libraryItem.book.uuid,
        userPesel: user.pesel,
      });
      const bookings = bookingService.getBookings();
      const userBooking = bookings.get(user.pesel);
      assert.isEmpty(userBooking);

      const updatedUser = userStore.getUserByPesel(user.pesel);
      assert.equal(updatedUser.checkUserCurrentPenalty(user), 10);
    });

    it('should throw error on try to return book booked by other user', () => {
      const bookingDays: number = 7;
      bookingService.bookBook({
        bookUuid: libraryItem.book.uuid,
        userPesel: user.pesel,
        bookingDays,
      });
      date += daysToMillis(bookingDays);
      set(date);
      assert.throws(() => {
        bookingService.returnBook({
          bookUuid: libraryItem.book.uuid,
          userPesel: user2.pesel,
        });
      }, 'Passed book is not connected with this user. Cannon proceed.');
    });

    it('should throw error on try to return book not booked by user', () => {
      assert.throws(() => {
        bookingService.returnBook({
          bookUuid: libraryItem.book.uuid,
          userPesel: user.pesel,
        });
      }, 'Passed book is not connected with this user. Cannon proceed.');
    });
  });
});
