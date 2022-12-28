//booking-service.exception.ts

export class BookingServiceError extends Error {
  constructor(readonly message: string) {
    super(message);
  }
}
