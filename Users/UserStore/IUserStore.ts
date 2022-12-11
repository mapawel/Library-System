import { User } from '../User';
import { UserProps } from '../UserPropsType';

export interface IUserStore {
  addUser({ pesel, firstName, lastName }: UserProps): User | void;
  getUserByPesel(pesel: number): User | undefined;
}
