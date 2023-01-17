import { Booking } from '../Bookings/Booking/Booking.class.js';
import { millisToDays } from '../timeTranslateFns.js';

export class Penalty {
  public static checkCurrentPenalty(currentBookings: Booking[]): number {
    const now = Date.now();
    return (
      currentBookings.reduce(
        (acc: number, booking: Booking) =>
          acc +
          (now - booking.endDate.getTime() > 0
            ? Math.ceil(millisToDays(now - booking.endDate.getTime()))
            : 0),
        0
      ) || 0
    );
  }

  public static calculateBookingPenalty(booking: Booking): number {
    const now = Date.now();
    return now - booking.endDate.getTime() > 0
      ? Math.ceil(millisToDays(now - booking.endDate.getTime()))
      : 0;
  }
}
