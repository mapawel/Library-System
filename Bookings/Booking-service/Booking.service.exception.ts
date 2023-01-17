import { ExceptionPayload } from '../Bookings.types';

export class BookingServiceError extends Error {
  constructor(
    readonly message: string,
    readonly userPayload?: ExceptionPayload
  ) {
    super(message);
  }
}
