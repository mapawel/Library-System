import { UserProps } from './UserPropsType';
//TODO jak zrobić, aby klasa User nie była używana z zewnątrz, najlepiej aby nie było dostępu do możliwości tworzenia jej instancji tutaj a wyłącznie w klasie obejmującej Users ??

export class User {
  readonly pesel: number;
  private firstName: string;
  private lastName: string;

  constructor({ pesel, firstName, lastName }: UserProps) {
    this.pesel = pesel;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
