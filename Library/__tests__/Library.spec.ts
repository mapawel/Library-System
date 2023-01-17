import { Booking } from '../../Bookings/Booking/Booking.class';
import { assert } from 'chai';
import { set, reset } from 'mockdate';
import { bookMock, book2Mock } from './books.mock';
import { daysToMillis } from '../../timeTranslateFns';

describe('Library main service tests suite:', () => {
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

  describe('xx', () => {
    it('x', () => {
      //when
      //then
    });

    it('x', () => {
      //given
      const oneBookExceedingDays = 10;
      const newDate =
        date + daysToMillis(returnOneBookDays + oneBookExceedingDays / 2);
      set(newDate);
      //when
      //then
    });
  });
});
