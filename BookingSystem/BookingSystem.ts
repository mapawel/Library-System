import { Booking } from '../Booking/Booking';
import { Library } from '../Library/Library';
import { UserStore } from '../Users/UserStore/UserStore';

export class BookingSystem {
  private static instance: BookingSystem;
  private static userStore: UserStore;
  private static library: Library;
  private static bookings: Map<string, Booking[]> = new Map();

  private constructor() {
    BookingSystem.userStore = UserStore.getInstance();
    BookingSystem.library = Library.getLibrary();
  }

  public static getBookingSystem() {
    if (BookingSystem.instance) return BookingSystem.instance;
    return (BookingSystem.instance = new BookingSystem());
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
    // error if book is booked
    // error if user cannot book
  }
}
