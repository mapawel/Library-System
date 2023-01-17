import { Booking } from '../../Bookings/Booking/Booking.class.js';
import { BookStore } from '../../Books/Book-store/Book.store.js';
import { UserStore } from '../../Users/User-store/User.store.js';
import type { BookStoreItem } from '../../Books/Books.types';
import { Penalty } from '../../Penalty/Penalty.class.js';
import { User } from '../../Users/User/User.class.js';
import { BookingServiceError } from './Booking.service.exception.js';
import { BookingStore } from '../../Bookings/Booking-store/Booking.store.js';

export class BookingService {
  private static instance: BookingService | null;
  private readonly userStore: UserStore;
  private readonly bookStore: BookStore;
  private readonly bookings: BookingStore;

  private constructor() {
    this.userStore = UserStore.getInstance();
    this.bookStore = BookStore.getInstance();
    this.bookings = BookingStore.getInstance();
  }

  public static getInstance() {
    if (BookingService.instance) return BookingService.instance;
    return (BookingService.instance = new BookingService());
  }

  public static resetInstance() {
    BookingService.instance = null;
  }

  public getBookings(): Map<number, Booking[]> {
    return this.bookings.getBookings();
  }

  public bookBook({
    bookUuid,
    userPesel,
    bookingDays,
  }: {
    bookUuid: string;
    userPesel: number;
    bookingDays: number;
  }): Booking {
    const user: User = this.userStore.getUserByPesel(userPesel);
    const bookStoreItem: BookStoreItem = this.bookStore.getItemById(bookUuid);

    user.resetPenaltyIfPossible();
    this.validateToBook(user, bookStoreItem);

    const newBooking = new Booking(bookStoreItem.book, bookingDays);
    this.bookStore.connectOrDisconnectBook(bookUuid, user);
    const bookingsArr: Booking[] | undefined =
      this.bookings.getBookingsByPesel(userPesel);

    this.bookings.setBooking(
      userPesel,
      bookingsArr ? [...bookingsArr, newBooking] : [newBooking]
    );
    return newBooking;
  }

  public returnBook({
    bookUuid,
    userPesel,
  }: {
    bookUuid: string;
    userPesel: number;
  }): boolean {
    const user: User = this.userStore.getUserByPesel(userPesel);
    const bookStoreItem: BookStoreItem = this.bookStore.getItemById(bookUuid);

    const bookingsArr: Booking[] | undefined =
      this.bookings.getBookingsByPesel(userPesel);
    const foundBooking: Booking | undefined = bookingsArr?.find(
      (bookingToFind: Booking) => bookingToFind.book.uuid === bookUuid
    );
    this.validateToReturn(user, bookStoreItem);

    let penalty: number = 0;
    if (bookingsArr && foundBooking) {
      penalty = Penalty.calculateBookingPenalty(foundBooking);
    }

    user.setPenalty(penalty);

    this.bookStore.connectOrDisconnectBook(bookUuid, null);
    if (bookingsArr)
      this.bookings.setBooking(
        userPesel,
        bookingsArr.filter(
          (currentBooking: Booking) => currentBooking.book.uuid !== bookUuid
        )
      );
    return true;
  }

  private validateToBook(user: User, bookStoreItem: BookStoreItem): void {
    if (!user.checkIfCanBook())
      throw new BookingServiceError(
        'Passed user cannot book a book, is blocked! Cannon proceed.',
        {
          user,
          bookStoreItem,
        }
      );
    if (bookStoreItem.user)
      throw new BookingServiceError(
        'Passed book uuid points on the already booked book! Cannot proceed.',
        {
          user,
          bookStoreItem,
        }
      );

    const currentUserBookings: Booking[] | undefined =
      this.bookings.getBookingsByPesel(user.pesel);

    const currentPenalty: number = currentUserBookings
      ? Penalty.checkCurrentPenalty(currentUserBookings)
      : 0;
    if (currentPenalty >= 10)
      throw new BookingServiceError(
        'User is holding books too long and cannot book another one! User should return all books and weit for reset petalty.',
        {
          user,
          bookStoreItem,
        }
      );
  }

  private validateToReturn(user: User, bookStoreItem: BookStoreItem): void {
    if (bookStoreItem?.user?.pesel !== user.pesel) {
      throw new BookingServiceError(
        'Passed book is not connected with this user. Cannon proceed.',
        {
          user,
          bookStoreItem,
        }
      );
    }
  }
}
