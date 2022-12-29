import { ExceptionPayload } from './User-store.exception-payload.type';
export class UserStoreError extends Error {
  constructor(
    readonly message: string,
    readonly userPayload?: ExceptionPayload
  ) {
    super(message);
  }
}
