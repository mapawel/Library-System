import { User } from '../User/User.class';
import { UserParams } from '../User/User-params.type';

export interface IUserStore {
  addUser({ pesel, firstName, lastName }: UserParams): User;
  getUserByPesel(pesel: number): User;
}
