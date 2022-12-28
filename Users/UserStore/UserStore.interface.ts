import { User } from '../User.class';
import { UserParams } from '../UserParams.type';

export interface IUserStore {
  addUser({ pesel, firstName, lastName }: UserParams): User | void;
  getUserByPesel(pesel: number): User | undefined;
}
