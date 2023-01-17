import { Booking } from '../Booking/Booking.class';

export class BookingStore {
  private static instance: BookingStore | null;
  private readonly bookings: Map<number, Booking[]> = new Map();

  private constructor() {}

  public static getInstance() {
    if (BookingStore.instance) return BookingStore.instance;
    return (BookingStore.instance = new BookingStore());
  }

  public static resetInstance() {
    BookingStore.instance = null;
  }

  public getBookings(): Map<number, Booking[]> {
    return new Map(this.bookings);
  }

  public getBookingsByPesel(pesel: number): Booking[] | undefined {
    return this.bookings.get(pesel);
  }

  public setBooking(pesel: number, bookings: Booking[]): void {
    this.bookings.set(pesel, bookings);
  }
}
