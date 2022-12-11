import { UserProps } from './UserPropsType';
import { Booking } from '../Booking/Booking';
//TODO jak zrobić, aby klasa User nie była używana z zewnątrz, najlepiej aby nie było dostępu do możliwości tworzenia jej instancji tutaj a wyłącznie w klasie obejmującej UserStore ??

export class User {
  readonly pesel: number;
  private firstName: string;
  private lastName: string;
  private canBook: boolean = true;
  private penalty: number = 0;

  constructor({ pesel, firstName, lastName }: UserProps) {
    this.pesel = pesel;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
