export class UserStoreError extends Error {
  readonly name: string = 'User Store Error!';
  constructor(readonly message: string, readonly code: number) {
    super(message);
    Object.setPrototypeOf(this, UserStoreError.prototype);
  }
}
