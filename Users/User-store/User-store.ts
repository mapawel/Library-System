import { User } from '../User/User.class.js';
import { IUserStore } from './User-store.interface';
import { UserParams } from '../User/User-params.type';
import { UserStoreError } from './User-store.exception.js';

export class UserStore implements IUserStore {
  private static instance: UserStore | null = null;
  private readonly users: Map<number, User> = new Map();

  private constructor() {}

  public static getInstance(): UserStore {
    if (UserStore.instance) return UserStore.instance;
    return (UserStore.instance = new UserStore());
  }

  public static resetInstance(): void {
    UserStore.instance = null;
  }

  public addUser({ pesel, firstName, lastName }: UserParams): User {
    // VALIDATORS WILL BE ADD HERE TO VALIDATE pesel, firstName, lastName !
    if (this.users.get(pesel))
      throw new UserStoreError(
        'There is a user with this pesel in our base! User not added again!',
        { pesel, firstName, lastName }
      );
    const newUser = new User({ pesel, firstName, lastName });
    this.users.set(pesel, newUser);
    return newUser;
  }

  public getUserByPesel(pesel: number): User {
    const foundUser: User | undefined = this.users.get(pesel);
    if (!foundUser)
      throw new UserStoreError(
        'There is no user with this pesel in our base!',
        {
          pesel,
        }
      );
    return foundUser;
  }
}
