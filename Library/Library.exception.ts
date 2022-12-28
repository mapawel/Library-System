export class LibraryError extends Error {
  constructor(readonly message: string) {
    super(message);
  }
}
