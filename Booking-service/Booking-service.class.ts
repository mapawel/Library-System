import { Booking } from './Booking.class';
import { Library } from '../Library/Library.class';
import { UserStore } from '../Users/User-store/User-store.class';
import { LibraryItem } from '../Library/LibraryItem.type';
import { Penalty } from '../Penalty/Penalty.class';
import { User } from '../Users/User.class';
import { BookingServiceError } from './Booking-service.exception';

export class BookingService {
  private static instance: BookingService | null;
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
    const libraryItem: LibraryItem = this.library.getItemById(bookUuid);

    user.resetPenaltyIfPossible();
    this.validateToBook(user, libraryItem);

    const newBooking = new Booking(libraryItem.book, bookingDays);
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
  }): boolean {
    const user: User = this.userStore.getUserByPesel(userPesel);
    const libraryItem: LibraryItem = this.library.getItemById(bookUuid);

    const bookingsArr: Booking[] | undefined = this.bookings.get(userPesel);

    this.validateToReturn(user, libraryItem, bookingsArr);

    let penalty: number = 0;
    if (bookingsArr) {
      penalty = Penalty.calculateBookingPenalty(
        bookingsArr.find(
          (bookingToFind: Booking) => bookingToFind.book.uuid === bookUuid
        )
      );
    }

    user.setPenalty(penalty);

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

  public getBookings(): Map<number, Booking[]> {
    return new Map(this.bookings);
  }

  private validateToBook(user: User, libraryItem: LibraryItem): void {
    if (!user.checkIfCanBook())
      throw new BookingServiceError(
        'Passed user cannot book a book, is blocked! Cannon proceed.',
        {
          user,
          libraryItem,
        }
      );
    if (libraryItem.user)
      throw new BookingServiceError(
        'Passed book uuid points on the alread booked book! Cannot proceed.',
        {
          user,
          libraryItem,
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
          libraryItem,
        }
      );
  }

  private validateToReturn(
    user: User,
    libraryItem: LibraryItem,
    bookingsArr: Booking[] | undefined
  ): void {
    if (libraryItem?.user?.pesel !== user.pesel)
      throw new BookingServiceError(
        'Passed book is connected with other user! Cannot proceed the returnement by passed user.',
        {
          user,
          libraryItem,
        }
      );
    if (!bookingsArr || !bookingsArr?.length)
      throw new BookingServiceError(
        "Passed user doesn't have any book to return! Cannot proceed.",
        {
          user,
          libraryItem,
        }
      );
    if (
      bookingsArr.findIndex(
        (currentBooking: Booking) =>
          currentBooking.book.uuid === libraryItem?.book.uuid
      ) < 0
    )
      throw new BookingServiceError(
        "Passed user doesn't have this book to return! Cannot proceed.",
        {
          user,
          libraryItem,
        }
      );
  }
}
