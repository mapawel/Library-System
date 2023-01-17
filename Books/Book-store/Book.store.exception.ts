import { ExceptionPayload } from "Books/Books.types";

export class BookStoreError extends Error {
  constructor(
    readonly message: string,
    readonly userPayload?: ExceptionPayload
  ) {
    super(message);
  }
}
