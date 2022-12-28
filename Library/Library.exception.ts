import { ExceptionPayload } from './Library.exception-payload.type';

export class LibraryError extends Error {
  constructor(
    readonly message: string,
    readonly userPayload?: ExceptionPayload
  ) {
    super(message);
  }
}
