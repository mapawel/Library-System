import type { ExceptionPayload } from '../Users.types';

export class UserStoreError extends Error {
  constructor(
    readonly message: string,
    readonly userPayload?: ExceptionPayload
  ) {
    super(message);
  }
}
