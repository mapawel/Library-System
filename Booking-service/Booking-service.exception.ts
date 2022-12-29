import { ExceptionPayload } from "./Booking-service.exception-payload.type";

export class BookingServiceError extends Error {
  constructor(readonly message: string, readonly userPayload?: ExceptionPayload) {
    super(message);
  }
}
