import { UserStoreItem } from './UserStoreItemType';
import { User } from '../User';
import { IUserStore } from './IUserStore';
// TODO jak zrobić, aby nie było konieczności tworzenia obiektu a potem walidacji go z bazą, czy np. pesel występuje a jeśli tak to obiekt niepotrzebnie zajmuje pamięć... Moja propozycja, aby nie była z zewnątrz używana klasa User a tworzenie usera odbywało się tu w storze, gdzie najpierw nastąpi walidacja, czy user w storze występuje... Dodatkowo jeśli User stworzony jest dzięki storowi, to zapisywany jest w mapie jako z dodatkowym polem "active", które potem w innych modułach może być sprawdzane i świadczy o tym, że user został prawidłowo stworzony. ???

export class UserStore implements IUserStore {
  private static instance: UserStore | null = null;
  private static users: Map<number, UserStoreItem> = new Map();

  private constructor() {}

  public static getInstance(): UserStore {
    if (UserStore.instance) return UserStore.instance;
    return (UserStore.instance = new UserStore());
  }

  public addUser(user: User): UserStoreItem | void {
    if (this.getUserByPesel(user.pesel))
      throw new Error(
        'There is a user with this pesel in our base! User not added!'
      );
    UserStore.users.set(user.pesel, { user, active: true });
    return { user, active: true };
  }

  public getUserByPesel(pesel: number): UserStoreItem | undefined {
    return UserStore.users.get(pesel);
  }
}
