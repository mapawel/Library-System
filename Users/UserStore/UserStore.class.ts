import { User } from '../User.class';
import { IUserStore } from './UserStore.interface';
import { UserParams } from '../UserParams.type';
import { UserStoreError } from './UserStore.exception';

export class UserStore implements IUserStore {
  private static instance: UserStore | null = null;
  private readonly users: Map<number, User> = new Map();

  private constructor() {}

  public static getInstance(): UserStore {
    if (UserStore.instance) return UserStore.instance;
    return (UserStore.instance = new UserStore());
  }

  public addUser({ pesel, firstName, lastName }: UserParams): User | void {
    // VALIDATORS WILL BE ADD HERE TO VALIDATE pesel, firstName, lastName !
    if (this.getUserByPesel(pesel))
      throw new UserStoreError(
        'There is a user with this pesel in our base! User not added again!'
      );
    const newUser = new User({ pesel, firstName, lastName });
    this.users.set(pesel, newUser);
    return newUser;
  }

  public getUserByPesel(pesel: number): User | undefined {
    return this.users.get(pesel);
  }
}
