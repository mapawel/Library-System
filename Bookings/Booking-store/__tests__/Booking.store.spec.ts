import { assert } from 'chai';
import { BookingStore } from '../Booking.store';
import { userMock, user2Mock } from './user.mock';
import { bookingMock, booking2Mock } from './bookings.mock';
describe('Booking-store tests suite:', () => {
  let bookingStore: BookingStore;
  beforeEach(() => {
    bookingStore = BookingStore.getInstance();
  });
  afterEach(() => {
    BookingStore.resetInstance();
  });

  describe('getBookings() + setBooking():', () => {
    it('should return all bookings map after use of a setBooking method', () => {
      //given
      const mapToCompare = new Map();
      mapToCompare.set(userMock.pesel, [bookingMock, booking2Mock]);
      mapToCompare.set(user2Mock.pesel, [booking2Mock, bookingMock]);

      //when
      bookingStore.setBooking(userMock.pesel, [bookingMock, booking2Mock]);
      bookingStore.setBooking(user2Mock.pesel, [booking2Mock, bookingMock]);
      const expectedBookings = bookingStore.getBookings();
      //then
      assert.deepEqual(expectedBookings, mapToCompare);
    });
  });

  describe('getBookingsByPesel() + setBooking():', () => {
    it('should return bookins for passed user pesel after use of a setBooking method', () => {
      //when
      bookingStore.setBooking(userMock.pesel, [bookingMock, booking2Mock]);
      const expectedBooking = bookingStore.getBookingsByPesel(userMock.pesel);
      //then
      assert.deepEqual(expectedBooking, [bookingMock, booking2Mock]);
    });

    it('should get undefined on try to get bookings by non existing pesel', () => {
      //when
      const expectedUndefined = bookingStore.getBookingsByPesel(11111111111);
      //then
      assert.isUndefined(expectedUndefined);
    });
  });
});
