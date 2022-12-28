import { Booking } from './Booking.class';
import { Library } from '../Library/Library.class';
import { UserStore } from '../Users/User-store/User-store.class';
import { LibraryItem } from '../Library/LibraryItem.type';
import { User } from '../Users/User.class';
import { Book } from 'Book/Book.class';
import { BookingServiceError } from './Booking-service.exception';
import { millisToDays } from '../utils/millisToDays';

export class BookingService {
  private static instance: BookingService;
  private readonly userStore: UserStore;
  private readonly library: Library;
  private readonly bookings: Map<number, Booking[]> = new Map();

  private constructor() {
    this.userStore = UserStore.getInstance();
    this.library = Library.getInstance();
  }

  public static getInstance() {
    if (BookingService.instance) return BookingService.instance;
    return (BookingService.instance = new BookingService());
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
    const libraryItem: LibraryItem = this.library.getItemById(bookUuid);

    user?.resetPenaltyIfPossible();
    this.validateToBook(user, libraryItem);

    const newBooking = new Booking(libraryItem?.book, bookingDays);
    this.library.connectBookWhUser(bookUuid, user);
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
  }): true | void {
    const user: User = this.userStore.getUserByPesel(userPesel);
    const libraryItem: LibraryItem = this.library.getItemById(bookUuid);

    const bookingsArr: Booking[] | undefined = this.bookings.get(userPesel);

    this.validateToReturn(user, libraryItem, bookingsArr);

    const penalty = this.calculateBookingPenalty(
      bookingsArr?.find(
        (bookingToFind: Booking) => bookingToFind.book.uuid === bookUuid
      ) as Booking
    );
    user?.setPenalty(penalty);

    this.library.connectBookWhUser(bookUuid, null);
    if (bookingsArr)
      this.bookings.set(
        userPesel,
        bookingsArr.filter(
          (currentBooking: Booking) => currentBooking.book.uuid !== bookUuid
        )
      );
    return true;
  }

  public getBookings() {
    return new Map(this.bookings);
  }

  private validateToBook(
    user: User | undefined,
    libraryItem: LibraryItem | undefined
  ): void {
    if (!user?.checkIfCanBook())
      throw new BookingServiceError(
        'Passed user cannot book a book, is blocked! Cannon proceed.'
      );
    if (libraryItem?.user)
      throw new BookingServiceError(
        'Passed book uuid points on the alread booked book! Cannot proceed.'
      );
    const possiblyCurrentPenalty = this.checkCurrentPenalty(user.pesel);
    if (possiblyCurrentPenalty >= 10)
      throw new BookingServiceError(
        'User is holding books too long and cannot book another one! User should return all books and weit for reset petalty.'
      );
  }

  private validateToReturn(
    user: User | undefined,
    libraryItem: LibraryItem | undefined,
    bookingsArr: Booking[] | undefined
  ): void {
    if (libraryItem?.user?.pesel !== user?.pesel)
      throw new BookingServiceError(
        'Passed book is connected with other user! Cannot proceed the returnement by passed user.'
      );
    if (!bookingsArr || !bookingsArr?.length)
      throw new BookingServiceError(
        "Passed user doesn't have any book to return! Cannot proceed."
      );
    if (
      bookingsArr.findIndex(
        (currentBooking: Booking) =>
          currentBooking.book.uuid === libraryItem?.book.uuid
      ) < 0
    )
      throw new BookingServiceError(
        "Passed user doesn't have this book to return! Cannot proceed."
      );
  }

  private checkCurrentPenalty(userPesel: number): number {
    const currentBookings: Booking[] | undefined = this.bookings.get(userPesel);
    const now = Date.now();
    return (
      currentBookings?.reduce(
        (acc: number, booking: Booking) =>
          acc +
          (now - booking.endDate.getTime() > 0
            ? Math.ceil(millisToDays(now - booking.endDate.getTime()))
            : 0),
        0
      ) || 0
    );
  }

  private calculateBookingPenalty(booking: Booking): number {
    const now = Date.now();
    return now - booking.endDate.getTime() > 0
      ? Math.ceil(millisToDays(now - booking.endDate.getTime()))
      : 0;
  }
}
