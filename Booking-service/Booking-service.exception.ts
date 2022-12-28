export class BookingServiceError extends Error {
  constructor(readonly message: string) {
    super(message);
  }
}
