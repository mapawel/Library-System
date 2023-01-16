import { assert } from 'chai';
import { BookStoreItem } from '../../Books/Book-store/BookStoreItem.type';
import { User } from '../../Users/User/User.class';
import { UserStore } from '../../Users/User-store/User-store';
import { BookingService } from '../Booking-service';
import { BookStore } from '../../Books/Book-store/Book-store';
import { bookMock, book2Mock } from './book.mocks';
import { userMock, user2Mock } from './user.mocks';
import { Booking } from 'Booking-service/Booking.class';
import { set, reset } from 'mockdate';
import { daysToMillis } from '../../utils/daysToMillis';

describe('Booking-service tests suite:', () => {
  let bookingService: BookingService;
  let bookStore: BookStore;
  let userStore: UserStore;
  let bookStoreItem: BookStoreItem;
  let libraryItem2: BookStoreItem;
  let user: User;
  let user2: User;
  let date: number;

  beforeEach(() => {
    bookingService = BookingService.getInstance();
    bookStore = BookStore.getInstance();
    userStore = UserStore.getInstance();
    user = userStore.addUser(userMock);
    user2 = userStore.addUser(user2Mock);
    bookStoreItem = bookStore.addBook(bookMock);
    libraryItem2 = bookStore.addBook(book2Mock);
    date = Date.now();
    set(date);
  });

  afterEach(() => {
    BookingService.resetInstance();
    BookStore.resetInstance();
    UserStore.resetInstance();
    reset();
  });

  describe('bookBook() tests:', () => {
    it('should connect the bookStore item with user, create a new booking and save this booking in array of bookings at key of user pesel', () => {
      bookingService.bookBook({
        bookUuid: bookStoreItem.book.uuid,
        userPesel: user.pesel,
        bookingDays: 14,
      });

      const updatedLibraryItem = bookStore.getItemById(bookStoreItem.book.uuid);
      assert.deepEqual(updatedLibraryItem.user, user);

      const bookings: Map<number, Booking[]> = bookingService.getBookings();
      const expectedBooking = bookings.get(user.pesel);
      assert.equal(expectedBooking?.[0].book, bookStoreItem.book);
    });

    it('should throw error due to checkIfCanBook() validation while booking', () => {
      user.setPenalty(10);

      assert.throws(() => {
        bookingService.bookBook({
          bookUuid: bookStoreItem.book.uuid,
          userPesel: user.pesel,
          bookingDays: 14,
        });
      }, 'Passed user cannot book a book, is blocked! Cannon proceed.');
    });

    it('should throw error on try to book an already booked book', () => {
      bookingService.bookBook({
        bookUuid: bookStoreItem.book.uuid,
        userPesel: user.pesel,
        bookingDays: 14,
      });
      assert.throws(() => {
        bookingService.bookBook({
          bookUuid: bookStoreItem.book.uuid,
          userPesel: user.pesel,
          bookingDays: 14,
        });
      }, 'Passed book uuid points on the already booked book! Cannot proceed.');
    });

    it('should throw error on try to book if the already booked books for user generate penalty > 10', () => {
      const bookingDays: number = 7;
      bookingService.bookBook({
        bookUuid: bookStoreItem.book.uuid,
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
        bookUuid: bookStoreItem.book.uuid,
        userPesel: user.pesel,
        bookingDays,
      });
      date += daysToMillis(bookingDays);
      set(date);
      bookingService.returnBook({
        bookUuid: bookStoreItem.book.uuid,
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
        bookUuid: bookStoreItem.book.uuid,
        userPesel: user.pesel,
        bookingDays,
      });
      date += daysToMillis(bookingDays + 10);
      set(date);
      bookingService.returnBook({
        bookUuid: bookStoreItem.book.uuid,
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
        bookUuid: bookStoreItem.book.uuid,
        userPesel: user.pesel,
        bookingDays,
      });
      date += daysToMillis(bookingDays);
      set(date);
      assert.throws(() => {
        bookingService.returnBook({
          bookUuid: bookStoreItem.book.uuid,
          userPesel: user2.pesel,
        });
      }, 'Passed book is not connected with this user. Cannon proceed.');
    });

    it('should throw error on try to return book not booked by user', () => {
      assert.throws(() => {
        bookingService.returnBook({
          bookUuid: bookStoreItem.book.uuid,
          userPesel: user.pesel,
        });
      }, 'Passed book is not connected with this user. Cannon proceed.');
    });
  });
});
