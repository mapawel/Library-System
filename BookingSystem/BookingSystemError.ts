export class BookingSystemError extends Error {
  readonly name: string = 'Booking System Error!';
  constructor(readonly message: string, readonly code: number) {
    super(message);
    Object.setPrototypeOf(this, BookingSystemError.prototype);
  }
}
