export class UserStoreError extends Error {
  constructor(readonly message: string) {
    super(message);
  }
}
