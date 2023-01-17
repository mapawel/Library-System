import { assert } from 'chai';
import { User } from '../User.class';
import { userMock } from './user.mock';
import { set, reset } from 'mockdate';
import { daysToMillis } from '../../../timeTranslateFns';

describe('User tests suite:', () => {
  //given
  let user: User | null;
  beforeEach(() => {
    user = new User(userMock);
  });
  afterEach(() => {
    user = null;
  });

  describe('setPenalty() test + checkIfCanBook():', () => {
    it('should set penalty = 9 and so checkIfCanBook() should return true', () => {
      //when
      user?.setPenalty(9);
      //then
      assert.strictEqual(user?.checkIfCanBook(), true);
    });
    it('should set penalty = 10 and so checkIfCanBook() should return false', () => {
      //when
      user?.setPenalty(10);
      //then
      assert.strictEqual(user?.checkIfCanBook(), false);
    });
  });

  describe('resetPenaltyIfPossible() test:', () => {
    //given
    let date: number;
    beforeEach(() => {
      date = Date.now();
      user?.setPenalty(10);
    });
    afterEach(() => {
      reset();
    });

    it('should not reset penalty (less than 30 days passed)', () => {
      //given
      date += daysToMillis(29);
      set(date);
      //when
      user?.resetPenaltyIfPossible();
      //then
      assert.strictEqual(user?.checkIfCanBook(), false);
    });

    it('should reset penalty (30 days passed)', () => {
      //given
      date += daysToMillis(30);
      set(date);
      //when
      user?.resetPenaltyIfPossible();
      //then
      assert.strictEqual(user?.checkIfCanBook(), true);
    });
  });
});
