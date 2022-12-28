import { ExceptionPayload } from "Booking-service/Booking-service.exception-payload.type";
export class UserStoreError extends Error {
  constructor(readonly message: string, readonly userPayload?: ExceptionPayload) {
    super(message);
  }
}
