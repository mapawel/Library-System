import { UserParams } from './UserParams.type';

export class User {
  readonly pesel: number;
  private readonly firstName: string;
  private readonly lastName: string;
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
