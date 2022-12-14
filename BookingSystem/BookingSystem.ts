import { Booking } from '../Booking/Booking';
import { Library } from '../Library/Library';
import { UserStore } from '../Users/UserStore/UserStore';
import { LibraryItem } from '../Library/LibraryItemType';
import { User } from '../Users/User';
import { Book } from 'Book/Book';

export class BookingSystem {
  private static instance: BookingSystem;
  private static userStore: UserStore;
  private static library: Library;
  private static bookings: Map<number, Booking[]> = new Map();

  private constructor() {
    BookingSystem.userStore = UserStore.getInstance();
    BookingSystem.library = Library.getLibrary();
  }

  public static getBookingSystem() {
    if (BookingSystem.instance) return BookingSystem.instance;
    return (BookingSystem.instance = new BookingSystem());
  }

  private validateIfExist(
    user: User | undefined,
    libraryItem: LibraryItem | undefined
  ): void {
    if (!user) throw new Error('Passed user pesel not found! Cannon proceed.');
    if (!libraryItem)
      throw new Error('Passed book uuid not found! Cannon proceed.');
  }

  private validateToBook(
    user: User | undefined,
    libraryItem: LibraryItem | undefined
  ): void {
    if (!user?.checkIfCanBook())
      throw new Error(
        'Passed user cannot book a book, is blocked! Cannon proceed.'
      );
    if (libraryItem?.user)
      throw new Error(
        'Passed book uuid points on the alread booked book! Cannot proceed.'
      );
    const possiblyCurrentPenalty = this.checkCurrentPenalty(user.pesel);
    if (possiblyCurrentPenalty >= 10)
      throw new Error(
        'User is holding books too long and cannot book another one! User should return all books and weit for reset petalty.'
      );
  }

  private validateToReturn(
    user: User | undefined,
    libraryItem: LibraryItem | undefined,
    bookingsArr: Booking[] | undefined
  ): void {
    if (libraryItem?.user?.pesel !== user?.pesel)
      throw new Error(
        'Passed book is connected with other user! Cannot proceed the returnement by passed user.'
      );
    if (!bookingsArr || !bookingsArr?.length)
      throw new Error(
        "Passed user doesn't have any book to return! Cannot proceed."
      );
    if (
      bookingsArr.findIndex(
        (currentBooking: Booking) =>
          currentBooking.book.uuid === libraryItem?.book.uuid
      ) < 0
    )
      throw new Error(
        "Passed user doesn't have this book to return! Cannot proceed."
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
      BookingSystem.userStore.getUserByPesel(userPesel);
    const libraryItem: LibraryItem | undefined =
      BookingSystem.library.getItemById(bookUuid);
    this.validateIfExist(user, libraryItem);

    user?.refreshPenalty();
    this.validateToBook(user, libraryItem);

    const newBooking = new Booking(libraryItem?.book as Book, bookingDays);
    BookingSystem.library.connectBookWhUser(bookUuid, user as User);
    const bookingsArr: Booking[] | undefined =
      BookingSystem.bookings.get(userPesel);
    BookingSystem.bookings.set(
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
      BookingSystem.userStore.getUserByPesel(userPesel);
    const libraryItem: LibraryItem | undefined =
      BookingSystem.library.getItemById(bookUuid);
    this.validateIfExist(user, libraryItem);

    const bookingsArr: Booking[] | undefined =
      BookingSystem.bookings.get(userPesel);

    this.validateToReturn(user, libraryItem, bookingsArr);

    const penalty = this.calculateBookingPenalty(
      bookingsArr?.find(
        (bookingToFind: Booking) => bookingToFind.book.uuid === bookUuid
      ) as Booking
    );
    user?.setPenalty(penalty);

    BookingSystem.library.connectBookWhUser(bookUuid, null);
    if (bookingsArr)
      BookingSystem.bookings.set(
        userPesel,
        bookingsArr.filter(
          (currentBooking: Booking) => currentBooking.book.uuid !== bookUuid
        )
      );
    return true;
  }

  private checkCurrentPenalty(userPesel: number): number {
    const currentBookings: Booking[] | undefined =
      BookingSystem.bookings.get(userPesel);
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
    return new Map(BookingSystem.bookings);
  }
}
