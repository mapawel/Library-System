export class LibraryError extends Error {
  readonly name: string = 'Library System Error!';
  constructor(readonly message: string, readonly code: number) {
    super(message);
    Object.setPrototypeOf(this, LibraryError.prototype);
  }
}
