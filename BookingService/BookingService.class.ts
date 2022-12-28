import { Booking } from './Booking.class';
import { Library } from '../Library/Library.class';
import { UserStore } from '../Users/UserStore/UserStore.class';
import { LibraryItem } from '../Library/LibraryItem.type';
import { User } from '../Users/User.class';
import { Book } from 'Book/Book.class';
import { BookingServiceError } from './BookingService.exception';

export class BookingService {
  private static instance: BookingService;
  private static userStore: UserStore;
  private static library: Library;
  private static bookings: Map<number, Booking[]> = new Map();

  private constructor() {
    BookingService.userStore = UserStore.getInstance();
    BookingService.library = Library.getLibrary();
  }

  public static getBookingService() {
    if (BookingService.instance) return BookingService.instance;
    return (BookingService.instance = new BookingService());
  }

  private validateIfExist(
    user: User | undefined,
    libraryItem: LibraryItem | undefined
  ): void {
    if (!user)
      throw new BookingServiceError(
        'Passed user pesel not found! Cannon proceed.',
        500
      );
    if (!libraryItem)
      throw new BookingServiceError(
        'Passed book uuid not found! Cannon proceed.',
        500
      );
  }

  private validateToBook(
    user: User | undefined,
    libraryItem: LibraryItem | undefined
  ): void {
    if (!user?.checkIfCanBook())
      throw new BookingServiceError(
        'Passed user cannot book a book, is blocked! Cannon proceed.',
        500
      );
    if (libraryItem?.user)
      throw new BookingServiceError(
        'Passed book uuid points on the alread booked book! Cannot proceed.',
        500
      );
    const possiblyCurrentPenalty = this.checkCurrentPenalty(user.pesel);
    if (possiblyCurrentPenalty >= 10)
      throw new BookingServiceError(
        'User is holding books too long and cannot book another one! User should return all books and weit for reset petalty.',
        500
      );
  }

  private validateToReturn(
    user: User | undefined,
    libraryItem: LibraryItem | undefined,
    bookingsArr: Booking[] | undefined
  ): void {
    if (libraryItem?.user?.pesel !== user?.pesel)
      throw new BookingServiceError(
        'Passed book is connected with other user! Cannot proceed the returnement by passed user.',
        500
      );
    if (!bookingsArr || !bookingsArr?.length)
      throw new BookingServiceError(
        "Passed user doesn't have any book to return! Cannot proceed.",
        500
      );
    if (
      bookingsArr.findIndex(
        (currentBooking: Booking) =>
          currentBooking.book.uuid === libraryItem?.book.uuid
      ) < 0
    )
      throw new BookingServiceError(
        "Passed user doesn't have this book to return! Cannot proceed.",
        500
      );
  }

  public bookBook({
    bookUuid,
    userPesel,
    bookingDays,
  }: {
    bookUuid: string;
    userPesel: number;
    bookingDays: number;
  }): Booking | void {
    const user: User | undefined =
      BookingService.userStore.getUserByPesel(userPesel);
    const libraryItem: LibraryItem | undefined =
      BookingService.library.getItemById(bookUuid);
    this.validateIfExist(user, libraryItem);

    user?.refreshPenalty();
    this.validateToBook(user, libraryItem);

    const newBooking = new Booking(libraryItem?.book as Book, bookingDays);
    BookingService.library.connectBookWhUser(bookUuid, user as User);
    const bookingsArr: Booking[] | undefined =
      BookingService.bookings.get(userPesel);
    BookingService.bookings.set(
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
    const user: User | undefined =
      BookingService.userStore.getUserByPesel(userPesel);
    const libraryItem: LibraryItem | undefined =
      BookingService.library.getItemById(bookUuid);
    this.validateIfExist(user, libraryItem);

    const bookingsArr: Booking[] | undefined =
      BookingService.bookings.get(userPesel);

    this.validateToReturn(user, libraryItem, bookingsArr);

    const penalty = this.calculateBookingPenalty(
      bookingsArr?.find(
        (bookingToFind: Booking) => bookingToFind.book.uuid === bookUuid
      ) as Booking
    );
    user?.setPenalty(penalty);

    BookingService.library.connectBookWhUser(bookUuid, null);
    if (bookingsArr)
      BookingService.bookings.set(
        userPesel,
        bookingsArr.filter(
          (currentBooking: Booking) => currentBooking.book.uuid !== bookUuid
        )
      );
    return true;
  }

  private checkCurrentPenalty(userPesel: number): number {
    const currentBookings: Booking[] | undefined =
      BookingService.bookings.get(userPesel);
    const now = Date.now();
    return (
      currentBookings?.reduce(
        (acc: number, booking: Booking) =>
          acc +
          (now - booking.endDate.getTime() > 0
            ? Math.ceil((now - booking.endDate.getTime()) / 1000 / 3600 / 24)
            : 0),
        0
      ) || 0
    );
  }

  private calculateBookingPenalty(booking: Booking): number {
    const now = Date.now();
    return now - booking.endDate.getTime() > 0
      ? Math.ceil((now - booking.endDate.getTime()) / 1000 / 3600 / 24)
      : 0;
  }

  public getBookings() {
    return new Map(BookingService.bookings);
  }
}
