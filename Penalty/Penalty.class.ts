import { Booking } from '../Booking-service/Booking.class';
import { millisToDays } from '../utils/millisToDays';

export class Penalty {
  public static checkCurrentPenalty(
    currentBookings: Booking[] | undefined
  ): number {
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

  public static calculateBookingPenalty(booking: Booking | undefined): number {
    if (!booking) return 0;
    const now = Date.now();
    return now - booking.endDate.getTime() > 0
      ? Math.ceil(millisToDays(now - booking.endDate.getTime()))
      : 0;
  }
}
