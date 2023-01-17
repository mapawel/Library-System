import { Booking } from '../../Bookings/Booking/Booking.class';
import { assert } from 'chai';
import { set, reset } from 'mockdate';
import { Penalty } from '../Penalty.class';
import { bookMock, book2Mock } from './books.mock';
import { daysToMillis } from '../../timeTranslateFns';

describe('Penalty tests suite:', () => {
  const returnOneBookDays = 10;
  let date: number;
  const bookings: Booking[] = [];

  beforeEach(() => {
    date = Date.now();
    set(date);
    bookings.push(new Booking(bookMock, returnOneBookDays));
    bookings.push(new Booking(book2Mock, returnOneBookDays));
  });

  afterEach(() => {
    reset();
    bookings.length = 0;
  });

  describe('checkCurrentPenalty():', () => {
    it('should return penalty = 0 due to not exceeding return deadline', () => {
      //when
      const expectedPenalty = Penalty.checkCurrentPenalty(bookings);
      //then
      assert.equal(expectedPenalty, 0);
    });

    it('should return penalty = 10 due to exceeding a return deadline by 5 days for each od 2 books', () => {
      //given
      const oneBookExceedingDays = 10;
      const newDate =
        date + daysToMillis(returnOneBookDays + oneBookExceedingDays / 2);
      set(newDate);
      //when
      const expectedPenalty = Penalty.checkCurrentPenalty(bookings);
      //then
      assert.equal(expectedPenalty, oneBookExceedingDays);
    });
  });

  describe('calculateBookingPenalty():', () => {
    it('should return penalty = 0 for given Booking', () => {
      //when
      const expectedPenalty = Penalty.calculateBookingPenalty(bookings[0]);
      //then
      assert.equal(expectedPenalty, 0);
    });

    it('should return penalty = 10 due to exceeding a return deadline by 10 days', () => {
      //given
      const oneBookExceedingDays = 10;
      const newDate =
        date + daysToMillis(returnOneBookDays + oneBookExceedingDays);
      set(newDate);
      //when
      const expectedPenalty = Penalty.calculateBookingPenalty(bookings[0]);
      //then
      assert.equal(expectedPenalty, oneBookExceedingDays);
    });
  });
});
