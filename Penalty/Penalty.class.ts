import { User } from '../Users/User/User.class.js';
import { Booking } from '../Booking-service/Booking.class.js';
import { millisToDays } from '../utils/millisToDays.js';
import { UserStore } from '../Users/User-store/User-store.js';

export class Penalty {
  public static checkCurrentPenalty(
    currentBookings: Booking[]
  ): number {
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
