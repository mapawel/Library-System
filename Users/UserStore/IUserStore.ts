import { User } from '../User';
import { UserStoreItem } from './UserStoreItemType';

export interface IUserStore {
  addUser(user: User): UserStoreItem | void;
  getUserByPesel(pesel: number): UserStoreItem | undefined;
}
