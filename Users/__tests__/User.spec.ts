import { assert } from 'chai';
import { User } from '../User.class';
import { userMock } from './user.mock';
import { set, reset } from 'mockdate';
import { daysToMillis } from '../../utils/daysToMillis';

describe('User tests suite:', () => {
  let user: User | null;
  beforeEach(() => {
    user = new User(userMock);
  });
  afterEach(() => {
    user = null;
  });

  describe('setPenalty() test + checkIfCanBook():', () => {
    it('should set penalty = 9 and so checkIfCanBook() should return true', () => {
      user?.setPenalty(9);
      assert.strictEqual(user?.checkIfCanBook(), true);
    });
    it('should set penalty = 10 and so checkIfCanBook() should return false', () => {
      user?.setPenalty(10);
      assert.strictEqual(user?.checkIfCanBook(), false);
    });
  });

  describe('resetPenaltyIfPossible() test:', () => {
    let date: number;
    beforeEach(() => {
      date = Date.now();
      user?.setPenalty(10);
    });
    afterEach(() => {
      reset();
    });

    it('should not reset penalty (less than 30 days passed)', () => {
      date += daysToMillis(29);
      set(date);
      user?.resetPenaltyIfPossible();
      assert.strictEqual(user?.checkIfCanBook(), false);
    });

    it('should reset penalty (30 days passed)', () => {
      date += daysToMillis(30);
      set(date);
      user?.resetPenaltyIfPossible();
      assert.strictEqual(user?.checkIfCanBook(), true);
    });
  });
});
