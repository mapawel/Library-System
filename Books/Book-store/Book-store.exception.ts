import { ExceptionPayload } from './Book-store.exception-payload.type';

export class BookStoreError extends Error {
  constructor(
    readonly message: string,
    readonly userPayload?: ExceptionPayload
  ) {
    super(message);
  }
}
