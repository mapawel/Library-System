import { Booking } from './Booking.class.js';
import { BookStore } from '../Books/Book-store/Book-store.js';
import { UserStore } from '../Users/User-store/User-store.js';
import { BookStoreItem } from '../Books/Book-store/BookStoreItem.type';
import { Penalty } from '../Penalty/Penalty.class.js';
import { User } from '../Users/User/User.class.js';
import { BookingServiceError } from './Booking-service.exception.js';

export class BookingService {
  private static instance: BookingService | null;
  private readonly userStore: UserStore;
  private readonly bookStore: BookStore;
  private readonly bookings: Map<number, Booking[]> = new Map();

  private constructor() {
    this.userStore = UserStore.getInstance();
    this.bookStore = BookStore.getInstance();
  }

  public static getInstance() {
    if (BookingService.instance) return BookingService.instance;
    return (BookingService.instance = new BookingService());
  }

  public static resetInstance() {
    BookingService.instance = null;
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
    const bookingsArr: Booking[] | undefined = this.bookings.get(userPesel);
    this.bookings.set(
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

    const bookingsArr: Booking[] | undefined = this.bookings.get(userPesel);

    this.validateToReturn(user, bookStoreItem);

    let penalty: number = 0;
    if (bookingsArr) {
      penalty = Penalty.calculateBookingPenalty(
        bookingsArr.find(
          (bookingToFind: Booking) => bookingToFind.book.uuid === bookUuid
        )
      );
    }

    user.setPenalty(penalty);

    this.bookStore.connectOrDisconnectBook(bookUuid, null);
    if (bookingsArr)
      this.bookings.set(
        userPesel,
        bookingsArr.filter(
          (currentBooking: Booking) => currentBooking.book.uuid !== bookUuid
        )
      );
    return true;
  }

  public getBookings(): Map<number, Booking[]> {
    return new Map(this.bookings);
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

    const currentPenalty: number = this.bookings.get(user.pesel)
      ? Penalty.checkCurrentPenalty(this.bookings.get(user.pesel))
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
