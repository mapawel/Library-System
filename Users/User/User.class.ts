import { UserParams } from '../Users.types';
import { daysToMillis } from '../../timeTranslateFns.js';

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

  public checkIfCanBook(): boolean {
    return this.canBook;
  }

  setPenalty(penalty: number): void {
    // VALIDATOR WILL BE ADD HERE
    this.penalty += penalty;
    if (this.penalty >= 10) {
      this.canBook = false;
      this.panaltyResetTime = new Date(Date.now() + daysToMillis(30));
    }
  }

  public resetPenaltyIfPossible(): void {
    if (
      this.panaltyResetTime?.getTime() &&
      Date.now() >= this.panaltyResetTime.getTime()
    ) {
      this.canBook = true;
      this.penalty = 0;
      this.panaltyResetTime = null;
    }
  }

  public checkUserCurrentPenalty(user: User): number {
    return this.penalty;
  }
}
