import { BookStore } from '../Books/Book-store/Book.store';
import { UserStore } from '../Users/User-store/User.store';
import { Penalty } from '../Penalty/Penalty.class';
import { BookingService } from 'Bookings/Booking-service/Booking.service';
import { Book } from '../Books/Book/Book.class';
import { BookStoreItem } from 'Books/Books.types';
import { User } from '../Users/User/User.class';
import { UserParams } from '../Users/Users.types';
import { Booking } from '../Bookings/Booking/Booking.class';

export class Library {
  private static instance: Library | null = null;
  private readonly books: BookStore;
  private readonly users: UserStore;
  private readonly bookings: BookingService;

  private constructor() {
    this.books = BookStore.getInstance();
    this.users = UserStore.getInstance();
    this.bookings = BookingService.getInstance();
  }

  public static getInstance(): Library {
    if (Library.instance) return Library.instance;
    return (Library.instance = new Library());
  }

  public static resetInstance(): void {
    Library.instance = null;
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
    return this.bookings.bookBook({ bookUuid, userPesel, bookingDays });
  }

  public returnBook({
    bookUuid,
    userPesel,
  }: {
    bookUuid: string;
    userPesel: number;
  }): boolean {
    return this.bookings.returnBook({
      bookUuid,
      userPesel,
    });
  }

  public getBookingsMap(): Map<number, Booking[]> {
    return this.bookings.getBookings();
  }

  public getBookById(uuid: string): BookStoreItem {
    return this.books.getItemById(uuid);
  }

  public addBook(book: Book): BookStoreItem {
    return this.books.addBook(book);
  }

  public removeBookById(uuid: string): BookStoreItem {
    return this.books.getItemById(uuid);
  }

  public addUser({ pesel, firstName, lastName }: UserParams): User {
    return this.users.addUser({ pesel, firstName, lastName });
  }

  public getUserByPesel(pesel: number): User {
    return this.users.getUserByPesel(pesel);
  }
}
