
//booking-service.exception.ts

export class BookingServiceError extends Error {
  readonly name: string = 'Booking System Error!';
  constructor(readonly message: string, readonly code: number) {
    super(message);
    Object.setPrototypeOf(this, BookingServiceError.prototype);
  }
}
