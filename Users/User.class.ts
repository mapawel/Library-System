import { UserParams } from './UserParams.type';
//TODO jak zrobić, aby klasa User nie była używana z zewnątrz, najlepiej aby nie było dostępu do możliwości tworzenia jej instancji tutaj a wyłącznie w klasie obejmującej UserStore ??
// Jak zrobić aby nie można było korzystać mając odwołanie do instancji user z metod np. setPenalty a móc je tylko wykorzystać w konkretnej klasie, np. BookingSystem?

export class User {
  readonly pesel: number;
  private firstName: string;
  private lastName: string;
  private canBook: boolean = true;
  private penalty: number = 0;
  private panaltyResetTime: Date | null = null;

  constructor({ pesel, firstName, lastName }: UserParams) {
    this.pesel = pesel;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  checkIfCanBook(): boolean {
    return this.canBook;
  }

  setPenalty(penalty: number) {
    // VALIDATOR WILL BE ADD HERE
    this.penalty += penalty;
    if (this.penalty >= 10) {
      this.canBook = false;
      this.panaltyResetTime = new Date(Date.now() + 1000 * 3600 * 24 * 30);
    }
  }

  refreshPenalty() {
    if (
      this.panaltyResetTime?.getTime() &&
      Date.now() >= this.panaltyResetTime.getTime()
    ) {
      this.canBook = true;
      this.penalty = 0;
      this.panaltyResetTime = null;
    }
  }
}
