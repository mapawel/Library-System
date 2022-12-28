import { User } from '../User.class';
import { UserParams } from '../User-params.type';

export interface IUserStore {
  addUser({ pesel, firstName, lastName }: UserParams): User;
  getUserByPesel(pesel: number): User;
}
