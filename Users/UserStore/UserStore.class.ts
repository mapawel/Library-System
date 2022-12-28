import { User } from '../User.class';
import { IUserStore } from './UserStore.interface';
import { UserParams } from '../UserParams.type';
import { UserStoreError } from './UserStore.exception';
// TODO jak zapewnić wyłącznie tej klasie możliwość tworzenia instancji User?? Chcę to zrobić, bo od razu jest walidacja czy nie ma dubli oraz user zapisywany jest w storze. Gdy ktoś stworzy tylko obiekt User klasą User to zajmuje to niepotrzebnie pamięć a chcąc potem wykorzystać takiego usera nie da się, bo nie występuje w storze.
// TODO czy można używać kodów błędów ze standardu HTTP? Raczej swoje własne?

export class UserStore implements IUserStore {
  private static instance: UserStore | null = null;
  private static users: Map<number, User> = new Map();

  private constructor() {}

  public static getInstance(): UserStore {
    if (UserStore.instance) return UserStore.instance;
    return (UserStore.instance = new UserStore());
  }

  public addUser({ pesel, firstName, lastName }: UserParams): User | void {
    // VALIDATORS WILL BE ADD HERE TO VALIDATE pesel, firstName, lastName !
    if (this.getUserByPesel(pesel))
      throw new UserStoreError(
        'There is a user with this pesel in our base! User not added again!',
        500
      );
    const newUser = new User({ pesel, firstName, lastName });
    UserStore.users.set(pesel, newUser);
    return newUser;
  }

  public getUserByPesel(pesel: number): User | undefined {
    return UserStore.users.get(pesel);
  }
}
